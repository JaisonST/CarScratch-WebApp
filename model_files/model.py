import sys 
import cv2 
import numpy as np 
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from load import load
from tensorflow.keras.preprocessing import image
from object_detection.utils import visualization_utils as viz_utils

def callModel():
    damageCount = 0

    # Target folder
    target_folder = './uploads/' + sys.argv[1] + '/'
    test_images = os.listdir(target_folder)

    # Retrieve label map, detection model and clearance model 
    loaded_params = load()

    # Layer 1 : Clearance model
    model = loaded_params["model"]

    # Filtering and running detections
    for i in test_images:
        # # Resizing image to suit modelled parameters
        img = image.load_img(target_folder + i, target_size = (64, 64))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis = 0)

        # Prediction
        pred = model.predict(x)

        # Mapping prediction to the label 
        isDamage = ['Clear', 'Damaged']
        prediction = isDamage[np.argmax(pred)]
        print(prediction)

        # Layer 2: Object detection model 
        if(prediction == "Damaged"):
            damageCount = damageCount + 1
            file = target_folder + i
            callDetectionModel(file, loaded_params, i, target_folder)
        
        print("Damaged: ", damageCount)
        print("Clean: ", len(test_images) - damageCount)

# Function to run detections
@tf.function
def detect_fn(image, detection_model):
    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)
    return detections

# Function to handle preprocessing and draw boxes
def callDetectionModel(file, loaded_params, filename, target_folder):
    img = cv2.imread(file)
    image_np = np.array(img)
    input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)

    # Calling detection model
    detections = detect_fn(input_tensor, loaded_params['detection_model'])

    # Unpacking detection params
    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    image_np_with_detections = image_np.copy()

    # Printing detection
    index = detections['detection_classes'][0] + 1 
    print(loaded_params['category_index'][index]['name'])

    # Draw boxes
    viz_utils.visualize_boxes_and_labels_on_image_array(
                image_np_with_detections,
                detections['detection_boxes'],
                detections['detection_classes']+1,
                detections['detection_scores'],
                loaded_params['category_index'],
                use_normalized_coordinates=True,
                max_boxes_to_draw=5,
                min_score_thresh=.6,
                agnostic_mode=False)

    save_path = target_folder + '/detected' + str(filename)
    cv2.imwrite(save_path, image_np_with_detections)

if __name__ == '__main__':
    callModel()

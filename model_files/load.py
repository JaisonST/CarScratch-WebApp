import os 
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow.keras.models import load_model
from object_detection.utils import label_map_util
from object_detection.builders import model_builder
from object_detection.utils import config_util
import json

def load():
    loaded_params ={}

    # Load model
    model = load_model("./model_files/scratch.h5")

    configs = config_util.get_configs_from_pipeline_file("./model_files/pipeline.config")
    detection_model = model_builder.build(model_config=configs['model'], is_training=False)

    ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
    ckpt.restore(r"D:\Car_Damage\Tensorflow\workspace\models\my_ssd_mobnet\ckpt-25").expect_partial()

    category_index = label_map_util.create_category_index_from_labelmap("./model_files/label_map.pbtxt")

    
    loaded_params = {
        "model" : model,
        "detection_model" : detection_model,
        "category_index" : category_index
    }
    
    return loaded_params

if __name__ == "__main__":
    load()


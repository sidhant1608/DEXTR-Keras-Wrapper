#!/usr/bin/env python

from PIL import Image
import numpy as np
from matplotlib import pyplot as plt
from keras import backend as K
import tensorflow as tf
from networks.dextr import DEXTR
from mypath import Path
from helpers import helpers as helpers
import datetime





# Handle input and output args


print("SIKC")


    #  Read image and click the points
def mainFunction(input_dextr,bbox,imgname, shapes):
    setupTime = datetime.datetime.now()
    modelName = 'dextr_pascal-sbd'
    pad = 50
    thres = 0.8
    gpu_id = 0
    sess = tf.Session()
    K.set_session(sess)
    with sess.as_default():
        net = DEXTR(nb_classes=1, resnet_layers=101, input_shape=(512, 512), weights=modelName,num_input_channels=4, classifier='psp', sigmoid=True)
    
    
        startTime = datetime.datetime.now()
        print("Setup Time:"+str(startTime - setupTime))

        

        # Run a forward pass
        pred = net.model.predict(input_dextr[np.newaxis, ...])[0, :, :, 0]
        result = helpers.crop2fullmask(pred, bbox, im_size=shapes[:2], zero_pad=True, relax=pad) > thres

    endTime = datetime.datetime.now()
    timeTaken = endTime - startTime
    # print(timeTaken)
    finalResult = {
        "img": imgname,
        "points": result.tolist(),
        "time": str(timeTaken)
    }
    return finalResult

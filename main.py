import flask
from flask import request, jsonify
# import running as demo
from flask_cors import CORS
import demo as demo
import numpy as np
import json
from PIL import Image
import numpy as np
from matplotlib import pyplot as plt
from keras import backend as K
import tensorflow as tf
from networks.dextr import DEXTR
from mypath import Path
from helpers import helpers as helpers


app = flask.Flask(__name__)
CORS(app)

# app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
	if 'img' in request.args:
		imgname = str(request.args['img'])
		if 'cords' in request.args:
			cord = str(request.args['cords'])
		else:
			return "Error: No co-ordinates field provided. Please specify co-ordinates."
	else:
		return "Error: No image field provided. Please specify an image."
	arr = cord.split('/')
	extreme = []
	for i in arr:
		point = i.split(',')
		ep = []
		for a in point:
			if '[' in a:
				ep.append(int(a[1:]))
			if ']' in a:
				ep.append(int(a[:-1]))
		extreme.append(np.asarray(ep))
	extreme = np.asarray(extreme)
	print(imgname)
	print(extreme)
	pad = 50
	thres = 0.8
	gpu_id = 0
	image = np.array(Image.open('ims/dog-cat.jpg'))
	#  Read image and click the points

	extreme_points_ori = extreme

	#  Crop image to the bounding box from the extreme points and resize
	bbox = helpers.get_bbox(image, points=extreme_points_ori, pad=pad, zero_pad=True)
	crop_image = helpers.crop_from_bbox(image, bbox, zero_pad=True)
	resize_image = helpers.fixed_resize(crop_image, (512, 512)).astype(np.float32)

	#  Generate extreme point heat map normalized to image values
	extreme_points = extreme_points_ori - [np.min(extreme_points_ori[:, 0]), np.min(extreme_points_ori[:, 1])] + [pad,pad]
																								
	extreme_points = (512 * extreme_points * [1 / crop_image.shape[1], 1 / crop_image.shape[0]]).astype(np.int)
	extreme_heatmap = helpers.make_gt(resize_image, extreme_points, sigma=10)
	extreme_heatmap = helpers.cstm_normalize(extreme_heatmap, 255)

	#  Concatenate inputs and convert to tensor
	input_dextr = np.concatenate((resize_image, extreme_heatmap[:, :, np.newaxis]), axis=2)
	a = demo.mainFunction(input_dextr,bbox, imgname, image.shape)
	return jsonify(a)

app.run()


import json
import os
import random
import numpy
from flask import Flask, render_template, request, jsonify
import logic
import sys

app = Flask(__name__)
current_dataset_name = "iris.csv"
current_dataset = logic.get_data_dict(current_dataset_name, skip_header=1)
current_x_axis = 0
current_y_axis = 1
current_category = 2
current_user_X_start = 0
current_user_Y_start = 0
current_user_X_end = 0
current_user_Y_end = 0

current_lists = ()
current_array_of_rows = []


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/getResults', methods=['get', 'post'])
def get_results():
    """
    Fetches the results (3-5 plot JSONS)
    :return:jsonDump of scatter plots
    """
    pass


@app.route('/updateCoords', methods=['get', 'post'])
def update_user_coordinates():
    """
    Updates the global coordinates of the user rectangle
    :return:
    """
    global current_user_X_start
    global current_user_Y_start
    global current_user_X_end
    global current_user_Y_end

    current_user_X_start = request.args.get('xStart')
    current_user_Y_start = request.args.get('yStart')
    current_user_X_end = request.args.get('xEnd')
    current_user_Y_end = request.args.get('yEnd')

    return_dict = {}
    return jsonify(**return_dict)


@app.route('/updateAxes', methods=['get', 'post'])
def update_axes():
    """
    Updates global coordinates of the user axes
    :return:
    """

    global current_x_axis
    current_x_axis = request.form.getlist('xOptions')[0]
    # print(current_x_axis)

    global current_y_axis
    current_y_axis = request.form.getlist('yOptions')[0]
    # print(current_y_axis)

    global current_category
    current_category = request.form.getlist('zOptions')[0]
    # print(current_category)

    return_dict = {}
    return jsonify(**return_dict)


@app.route('/getResultsPlotJson', methods=['get', 'post'])
def get_res_json():
    """
    Gets the resulting plots JSON
    :return:
    """

    jsonDict = dict()

    # get the results tuples from the logic class function
    results_tuples = logic.return_top_ranks(current_lists, current_user_X_start, current_user_X_end, current_user_Y_end,
                                            current_user_Y_start)
    rank1_category = results_tuples[0][0]
    rank2_category = ""
    rank3_category = ""

    # only provide rank category names if they exist
    if (len(results_tuples) > 1):
        rank2_category = results_tuples[1][0]
    if (len(results_tuples) > 2):
        rank3_category = results_tuples[2][0]

    rank1_list = []
    rank2_list = []
    rank3_list = []

    # traverse the rows and get respective rank values
    for row in current_array_of_rows:
        pair = {}
        pair['xValue'] = row.xValue
        pair['category'] = row.category
        pair['yValue'] = row.yValue
        if row.category == rank1_category:
            rank1_list.append(pair)
        if row.category == rank2_category:
            rank2_list.append(pair)
        if row.category == rank3_category:
            rank3_list.append(pair)

    # construct the dictionary
    jsonDict['datalist1'] = rank1_list
    jsonDict['datalist2'] = rank2_list
    jsonDict['datalist3'] = rank3_list

    return json.dumps(jsonDict)


@app.route('/getRepresentativePlotJson', methods=['get', 'post'])
def get_rep_json():
    """
    Gets the representative plot JSON
    :return:
    """

    global current_x_axis
    global current_y_axis
    global current_category
    global current_dataset
    global current_lists
    global current_array_of_rows

    cur_x = current_x_axis
    cur_y = current_y_axis
    jsonDict = dict()
    current_array_of_rows = logic.make_row_objects(current_dataset['dataset'], current_x_axis, current_y_axis,
                                                   current_category)
    some_list = []

    current_lists = logic.return_sorted_list(current_array_of_rows)

    for row in current_lists[0]:
        pair = {}

        pair['xValue'] = row.xValue
        pair['category'] = row.category
        pair['yValue'] = row.yValue
        some_list.append(pair)

    jsonDict['datalist'] = some_list
    jsonDict['colNames'] = str(current_dataset['column_names'])

    try:
        jsonDict['currentX'] = cur_x
    except:  # catch *all* exceptions
        e = sys.exc_info()
        jsonDict['currentX'] = str(e)
        print(e)
    jsonDict['currentY'] = cur_y
    jsonDict['currentZ'] = current_category
    jsonDict['cols'] = current_dataset['cols']
    jsonDict['rows'] = current_dataset['rows']
    jsonDict['datasetName'] = current_dataset_name
    jsonDict['columnNames'] = current_dataset['column_names']
    return json.dumps(jsonDict)


if __name__ == '__main__':
    app.run()

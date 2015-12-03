import operator
from classes.RowInfo import RowInfo

__author__ = 'an5ra'
import os
import numpy


def get_data_dict(file_name="iris.csv", skip_header=0):
    os.chdir("C:\\Users\\an5ra\\PycharmProjects\\scatPlot\\CSV")
    data_dict = dict()
    dataset = numpy.genfromtxt(file_name, delimiter=',', dtype=str)
    no_of_columns = dataset.shape[1]
    no_of_rows = dataset.shape[0]
    col_names = []
    if (skip_header > 0):
        for i in range(0, no_of_columns):
            col_names.append(dataset[0][i])
        dataset = dataset[1:]
    else:
        for i in range(0, no_of_columns):
            col_names.append("Column " + str(i + 1) + "")

    data_dict['column_names'] = col_names
    data_dict['dataset'] = dataset
    data_dict['cols'] = no_of_columns
    data_dict['rows'] = no_of_rows

    return data_dict


def make_row_objects(data_from_file, x_axis_number, y_axis_number, category_number):
    rows = []
    for row_data in data_from_file:
        row = RowInfo(row_data[x_axis_number], row_data[y_axis_number], row_data[category_number])
        rows.append(row)
    return rows


def return_sorted_list(all_rows):
    x_list = sorted(all_rows, key=lambda x: x.xValue, reverse=False)
    y_list = sorted(all_rows, key=lambda x: x.yValue, reverse=False)
    return (x_list, y_list)


def return_top_ranks(lists, xStart, xEnd, yStart, yEnd):
    """
    Returns a list of tuples with category and their scores
    :param lists: Tuple of sorted x and y list
    :param xStart:
    :param xEnd:
    :param yStart:
    :param yEnd:
    :return:
    """
    # extract the individual lists
    x_list = lists[0]
    y_list = lists[1]

    # extract a list of values from list of rows for X
    x_values = []
    for x_element in x_list:
        x_values.append(x_element.xValue)

    # extract a list of values from list of rows for Y
    y_values = []
    for y_element in y_list:
        y_values.append(y_element.yValue)

    # use binary search to see get the start and end indexes of X and Y
    xStartIndex = numpy.searchsorted(x_values, float(xStart))
    xEndIndex = numpy.searchsorted(x_values, float(xEnd))
    yStartIndex = numpy.searchsorted(y_values, float(yStart))
    yEndIndex = numpy.searchsorted(y_values, float(yEnd))

    # chop of the lists based on the index found above
    xSet = x_list[xStartIndex:xEndIndex]
    ySet = y_list[yStartIndex:yEndIndex]

    # get the intersection of both lists
    intersectionSet = set(xSet).intersection(ySet)

    dictOfResults = dict()

    # calculate the score of each category
    for row in intersectionSet:
        if row.category in dictOfResults:
            dictOfResults[row.category] += 1
        else:
            dictOfResults[row.category] = 1

    # convert the dictionary to a list of tuples and then sort it
    sorted_x = sorted(dictOfResults.items(), key=operator.itemgetter(1), reverse=True)

    return sorted_x

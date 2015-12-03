__author__ = 'an5ra'


class RowInfo:
    """
    Factory of objects storing information for each row of the dataset
    """
    index_counter = 0

    def __init__(self, xValue, yValue, category):
        self.xValue = xValue
        self.yValue = yValue
        self.category = category
        RowInfo.index_counter += 1
        self.index_number = RowInfo.index_counter;

    def __str__(self):
        return (str(self.xValue) + ", " + str(self.yValue) + ", " + str(self.category))

    # def __gt__(self, tuple):
    #     print(tuple)
    #     if tuple[1] == 'x':
    #         if self.xValue > tuple[0]:
    #             return 1
    #         else:
    #             if self.xValue == tuple[0]:
    #                 return 0
    #             else:
    #                 if self.xValue == tuple[0]:
    #                     return -1
    #     else:
    #         if self.yValue > tuple[0]:
    #             return 1
    #         else:
    #             if self.yValue == tuple[0]:
    #                 return 0
    #             else:
    #                 if self.yValue == tuple[0]:
    #                     return -1

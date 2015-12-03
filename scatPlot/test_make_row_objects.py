from unittest import TestCase
import logic

__author__ = 'an5ra'


class TestMake_row_objects(TestCase):
    def test_get_data_dict(self):
        data_from_file = logic.get_data_dict(skip_header=1)
        self.assertEqual(data_from_file['cols'], 5)

    def test_make_row_objects(self):
        data_from_file = logic.get_data_dict(skip_header=1)
        dataset = data_from_file['dataset']

        x_axis_number = 0
        y_axis_number = 1
        category_number = 4

        all_rows = logic.make_row_objects(dataset, x_axis_number, y_axis_number, category_number)
        self.assertEqual(len(all_rows), 150, "yes")

    def test_get_top_ranks(self):
        result = "iris-setosa"
        data_from_file = logic.get_data_dict(skip_header=1)
        dataset = data_from_file['dataset']

        x_axis_number = 0
        y_axis_number = 1
        category_number = 4

        current_array_of_rows = logic.make_row_objects(dataset, x_axis_number, y_axis_number, category_number)

        current_user_X_start = 2
        current_user_Y_start = 0
        current_user_X_end = 3
        current_user_Y_end = 3
        current_lists = logic.return_sorted_list(current_array_of_rows)
        results_tuples = logic.return_top_ranks(current_lists, current_user_X_start, current_user_X_end,
                                                current_user_Y_end,
                                                current_user_Y_start)

        print(results_tuples)
        self.assertEqual(result, "iris-setosa", "yes")

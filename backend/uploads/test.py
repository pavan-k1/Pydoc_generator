
def greet():
    print('hello everyone')

class FileUtils:
    """this is not a docstring just to confuse this i am giving """
    @staticmethod
    def get_extension(filename):
        return filename.split('.')[-1]

    @staticmethod
    def is_python_file(filename):
        return filename.endswith('.py')
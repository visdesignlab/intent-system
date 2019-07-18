from setuptools import setup, find_packages

setup(
    name='intent-server',
    version='1.0.0',
    packages=find_packages(),
    setup_requires=['pytest-runner'],
    tests_require=['pytest'],
    py_modules=[
        'intent_server.dataset',
        'intent_server.properties',
        'intent_server.vendor.interactions',
        'intent_server.algorithms',
    ],
)

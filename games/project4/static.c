#include <Python.h>

int trans(){
	PyObject *pModule,*pFunc;
    PyObject *pArgs, *pValue;
	
	/* import */
    pModule = PyImport_Import(PyString_FromString("static_py"));
	
    /* great_module.great_function */
    pFunc = PyObject_GetAttrString(pModule, "trans"); 
	
    /* build args */
    pArgs = PyTuple_New(3);
	//path   given a const value as try
	PyTuple_SetItem(pArgs,0, PyString_FromString("scenario\\p_3_inner"));
	//out_name  
	PyTuple_SetItem(pArgs,1, PyString_FromString("output.js"));
	//place
	//PyTuple_SetItem(pArgs,2, PyInt_FromInt(1));PyInt_FromLong
	PyTuple_SetItem(pArgs,2, PyInt_FromLong(1));
	//PyTuple_SetItem(pArgs,2, 1);
	
	/* call */
    pValue = PyObject_CallObject(pFunc, pArgs);
	
	return 0;



}

int main(int argc, char *argv[]) {
    Py_Initialize();
    //printf("%d",great_function_from_python(2));
	trans();
    Py_Finalize();
}
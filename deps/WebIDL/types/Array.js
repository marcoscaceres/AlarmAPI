/*
3.10.24. Arrays — T[]
@see http://dev.w3.org/2006/webapi/WebIDL/#idl-array
The T[] type is a parameterized type. The values of this type are non-null
references to arrays of values of type T. 

Unlike sequences, arrays are passed by reference. Passing an array to a
platform object could result in that array being modified by the object.

An array returned from a platform object might also be modified by the object,
and any modifications to the array performed by user code might be
acted upon by the platform object.

The element type of an array must not be a sequence or dictionary type.

Arrays can either be fixed length or variable length. Fixed length
arrays cannot have their length changed by user code after they have
been created, while variable length arrays can. Unless otherwise specified,
arrays are fixed length.

Arrays can also be designated as being read only. User code cannot 
modify the values of read only array elements. If an array is read only,
then it is also implicitly fixed length.

There is no way to represent a constant array value in IDL.

*/

define(function(require) {
    'use strict';
    var IDLType = require('WebIDL/types/IDLType'),
        WebIDL = require('WebIDL/interfaces/WebIDL');

    WebIDL.Array = function(T, value) {
        if(!(this instanceof WebIDL.Array)) {
            return toArray(T, value);
        }
        //The type name of an array type is the concatenation of the type name 
        //for T and the string “Array”.
        IDLType.call(this, T + "Array", toArray, value);

    };

    function PlatformArrayObject() {

    }
    PlatformArrayObject.prototype = Array.prototype;

    //An IDL array value V of type T[] is converted to an ECMAScript value as follows:
    function toESArray(V) {
        //If V is already represented by a platform array object, 
        //then the ECMAScript value is that platform array object.
        //Otherwise, the ECMAScript value is a newly created platform array object
        //that represents V.
        return V;
    }

    //An ECMAScript value V is converted to an IDL array value of type T[] as follows:
    function toArray(V, T) {
        var values, n;
        //If V is a platform array object whose element type is T,
        //then return the array that the platform array object represents.
        if(Object.getPrototypeOf(V) instanceof Array && "type" in V && V.type === T) {
            return V;
        }

        //Let values be the result of converting V to a sequence with element type T.
        values = V.map(function covert(item) {
            return WebIDL.toIDLValue(T, item);
        });

        //Let n be the length of values.
        n = values.length;

        //Return a new fixed length array of length n whose element values are the same as those in values.
        return values.slice(0);
    }

    WebIDL.Array.prototype = IDLType;
    return WebIDL.Array;
});
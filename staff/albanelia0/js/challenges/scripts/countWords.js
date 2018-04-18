'use strict'; 

function countWords(str){
  if (typeof str !== 'string')
    throw Error('input is not a string');
  return str.split(' ').length;

}
/*
���ܣ��ұߴ������а�����4��С���飬�ֱ��ҵ�ÿ��С�����е����ֵ��Ȼ������Ǵ����������γ�һ�������顣
���룺һ����ά([n][4])������
�������
���أ�ÿһά���������ɵ�������
author��yexinlei��2016.12.04
*/
function largestOfFour(arr) {
  // You can do this!
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    arr[i].sort(function (a, b) {        //����ά�����ÿһά���ս�������
      return b - a;
    });
  }

  for (i = 0; i < arr.length; i++) {     //���ź����������У�ÿһά�ĵ�һ��push���������С�
    result.push(arr[i][0]);
  }

  return result;
}
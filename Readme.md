![Nameco.js](Nameco.png)  

## Overview
---
A Javascript Library to embed text data into any image file.
You can embed data just few code like below.  

~~~js

var Img= new Image();
Img.src="Example.png";

var Obj=new Nameco();
Obj.Text="foo";//Set your data as string.
Obj.Base=Img; //Nameco.js writes your data into this.

var DataUrl=Obj.Encode();
//You can get DataUrl of image that embeded your data.

~~~

## Features
---
* Embed your string data into image. : **Nameco.Encode();**
* Decode your image that was encoded by Nameco.js.:**Nameco.Decode();**

 

## VS.-- Why Nameco?
---

In the data-hiding subject, There are a lot of way to embed your data into image file. For example,steganography or QR code .But Nameco was born. Why? Because Nameco is good at some points like below.

* Non limited data size
* Infinity pattern writing paramater
* Closs platform
* 2ch data writing---You can embed two of your data to one image. 

## Requirement
---
Nameco needs just below only.
* HTML5
* JavaScript  


## Usage
---

## Encode

You can encode like below. Please change each parameter to you needed.

~~~js

var Img= new Image();
Img.src="Example.png";

var Obj=new Nameco();
Obj.Mode = 0;
Obj.Base=Img; //Nameco.js writes your data into this.
Obj.StrFlg = true;
Obj.Text="foo";//Set your data as string.

var DataUrl=Obj.Encode();
//You can get DataUrl of image that embeded your data.

~~~

### Paramaters
|Name| Value type |Decsription           |
|-------|-------------|------------------|
|Mode| integer(0 to 3) |Color chanel mode. Nameco writes **.Text** to selected chanel of **.Base**. Color chanel is *0*: *Red* , *1*: *Green*, *2*:Blue,*3*:*Alpha*|
|Base| image object| Nameco writes **.Text** to this.|
|StrFlg|true/false|**True** : Do UTF16 like encoding before embed. **False**: Don't do.|
|Text| String | Your data as string. Nameco writes this to **.Base** |

* After running *.Encode()* method, DataURL is saved in *.DataURL*.


## Decode

You can decode like below. Please change each parameter to you needed.

~~~js

var Img= new Image();
Img.src="Embeded.png";

var Obj=new Nameco();
Obj.Mode = 0;
Obj.Img=Img; 
Obj.StrFlg = true;
var Text=Obj.Decode();//Text is gotten in here.
~~~

### Paramaters
|Name| Value type |Decsription           |
|-------|-------------|------------------|
|Mode| integer(0 to 3) |Color chanel mode. Nameco reads **.Text** from selected chanel of **.Img**. Color chanel is *0*: *Red* , *1*: *Green*, *2*:Blue,*3*:*Alpha*|
|Img| image object| Nameco decodes data from this.|
|StrFlg|true/false|**True** : Do UTF16 like decoding after decode. **False**: Don't do.|


* After running *.Decode()* method, Data(as Text) is saved in *.Text*.


## Advanced

Paramater **.ColorPlatet** is a little difficult to use paramater,but very powerful one.
Nameco repraces each character to color number. ColorPalet decides the number of each character. So If you use this well,you can encrypt your data.

## You would like to use Nameco?
---
You have to do just 2 thing. 1st, please upload and include Nameco.js to HTML . 2nd,please write **(c) 2017 Yusei Ito --Nameco.js**  in your application's credit .


## Contribution
---
Please send me pull request.

## Author-Yusei Ito
---

* [Twitter(ItyuJ)](http://twitter.com/ityuj/)
* [Website(I/O)](http://yusei.tk/)
* [github](http://github.com/yuseiito/)

## Licence 
MIT. See [LICENCE](LICENCE).



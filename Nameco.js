//*************("Nameco" class constractor)********


var Nameco = function() {

    this.Width = 1000; //ImageWidth
    this.Height = 500; //ImageHeight
    this.ColorPalet = [
        ['0', 100],
        ['1', 110],
        ['2', 120],
        ['3', 130],
        ['4', 140],
        ['5', 150],
        ['6', 160],
        ['7', 170],
        ['8', 180],
        ['9', 190],
        ['&', 255],
        ['#', 230],
        [';', 220],
        ['[', 40],
        [']', 10],
        ["", 0]
    ];
    //It's color palet. Methods refer this.
    //[char,colorValue]
    this.Mode = 0;
    //0:Red
    //1:Green
    //2:Blue
    //3:Alpha
    this.Base = null;
    //Base image for making Natural Nameco data.( <img> object)
    this.StrFlg = true;
    //true: Encode 'this.Text' with utf16  before making image , Decode text  with utf16 from image after getting text from image.
    //false: Don't do.
    this.Text = "";
    this.DataUrl = "";
    this.Img = null;

}

//****************("Nameco" class methods)*******

Nameco.prototype = {

    //****(convert image to text method ".Decode")****

    Decode: function() {

        //*****************(Include functions which ".Decode" method uses)**********************

        function Str_Dec(text) {

            var retext = "";

            do {
                var n = String(text).indexOf("&#");
                var m = String(text).indexOf(";");
                if ((n > -1) && (m > n)) {
                    //１文字分のコードを取得
                    var code = parseInt(text.substring(n + 2, m));
                    //コードを変換して接続
                    retext += String.fromCharCode(code);
                    //テキスト削除
                    text = text.substring(m + 1, text.length);
                } else {
                    text = "";
                }
            } while (text != "")
            //平文表示
            return retext;
        }



        var ColorToChr = function(number, ColorPalet) {

            var i = 0;
            while (ColorPalet[i][1] != number) {
                i = i + 1;
                if (i == 16) {
                    i = 15;
                    break;
                }
            }
            return ColorPalet[i][0];
        }

        var GetText = function(Width, Height, ColorPalet, ctx, mode) {
            //This function decodes image.
            //*********Arguments*****************
            //Width : Image width
            //Height: Image height
            //ColorPalet:ColorPaletArray
            //ctx:canvas context
            //*********************************

            var imageData = ctx.getImageData(0, 0, Width, Height);
            var txt = ""; //Text after decode

            var i = 0; //counter
            while (i < (Width * Height)) {
                var x = i % Width; //Decode here(x).
                var y = ((i - x) / Width); //Decode here (y).
                var m = ((y * (4 * Width)) + (x * 4)) | 0; //Index to access "image data" array

                txt = txt + ColorToChr(imageData.data[(m + mode)], ColorPalet);

                i = i + 1;
            }

            return txt;
        }


        //*********************(".Decode" method's body)*****************************


        var Nameco_Canvas = document.createElement("CANVAS");

        Nameco_Canvas.width = this.Img.width;
        Nameco_Canvas.height = this.Img.height;
        this.Width = this.Img.width;
        this.Height = this.Img.height;

        var ctx = Nameco_Canvas.getContext('2d');
        ctx.drawImage(this.Img, 0, 0);
        var txt = GetText(this.Img.width, this.Img.height, this.ColorPalet, ctx, this.Mode);
        var text_arr = String(txt).split('[;]');

        if (this.StrFlg) {
            text_arr = String(text_arr[0]).split('[#]');
            txt = Str_Dec(text_arr[1]);
        }

        return txt;

    },


    //****(convert text to image method ".Encode")**********************************************************
    Encode: function() {

        //@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-

        var Str_Enc = function(text) {
            //Converting String to HTML Encode function.
            var num = text.length;
            var retext = "";
            if (num > 0) {
                var i = 0;
                for (i = 0; i < num; i++) {
                    //Get a character and to be code
                    var code = text.charCodeAt(i);
                    //connect each character's code
                    if (code > -1) {
                        retext += "&#" + code + ";";
                    }
                }
            }
            return retext;
        }

        //@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-


        if (this.StrFlg) {

            this.Text = '[#]' + Str_Enc(this.Text) + "[;]";

        }
        var Nameco_Canvas = document.createElement("canvas"); //Working Canvas


        Nameco_Canvas.width = this.Base.naturalWidth;
        Nameco_Canvas.height = this.Base.naturalHeight;
        var ctx = Nameco_Canvas.getContext('2d');
        ctx.drawImage(this.Base, 0, 0);

        this.Width = Nameco_Canvas.width;
        this.Height = Nameco_Canvas.height;

        //Image size checking
        if (this.Text.length > Nameco_Canvas.width * Nameco_Canvas.height) {
            alert('Your Image size is too small. Please make  \n Image Width[px]×Image height[px] > ' + this.Text.length);
            exit;
        }

        var beforeTextArr = String(this.Text).split(''); //Each character each array element.
        var char = "";
        var imageData = ctx.getImageData(0, 0, this.Width, this.Height); // Get data of pixel all over the canvas.
        var ImgData = imageData.data;
        var length = beforeTextArr.length;
        var x = 0;
        var y = 0;
        var m = 0;
        var i = 0;

        while (i < length) {
            char = beforeTextArr[i];
            var j = 0;
            while (char != this.ColorPalet[j][0]) {
                j = j + 1;
                if (j == 16) {
                    j = 0;
                    break;
                }
            }

            var x = i % this.Width;
            var y = ((i - x) / this.Width);
            var m = ((y * (4 * this.Width)) + (x * 4)) | 0;


            //Make BlackPixel white.
            if (ImgData[m + 3] == 0) {
                ImgData[m] = 255;
                ImgData[m + 1] = 255;
                ImgData[m + 2] = 255;
            }

            ImgData[(m + this.Mode) | 0] = this.ColorPalet[j][1];


            i = (i + 1) | 0;


        }


        imageData.data = ImgData;
        ctx.putImageData(imageData, 0, 0); //Apply changes to the canvas.
        var png = Nameco_Canvas.toDataURL("image/png");
        this.DataUrl = png;
        return (png);

    }




}
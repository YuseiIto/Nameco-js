'use strict';

const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');
const str = require('./test_asset');

class Nameco {
    //Variables
    constructor() {
        this.width = 1000;
        this.height = 500;
        this.colorPalet = [
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

        this.mode = 0;
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

    static decodeStr(text) {

        let retext = "";

        do {
            let n = String(text).indexOf("&#");
            let m = String(text).indexOf(";");
            if ((n > -1) && (m > n)) {
                //Get the charcode of a single character
                let code = parseInt(text.substring(n + 2, m));
                //transate and join
                retext += String.fromCharCode(code);
                //Remove original text
                text = text.substring(m + 1, text.length);
            } else {
                text = "";
            }
        } while (text != "")
        //Return decodes text
        return retext;
    }




    encodeStr(text) {
        //Converting String to HTML Encode function.
        const num = text.length;
        let retext = "";
        if (num > 0) {
            let i = 0;
            for (i = 0; i < num; i++) {
                //Get a character and translate
                const code = text.charCodeAt(i);
                //connect each character's code
                if (code > -1) {
                    retext += "&#" + code + ";";
                }
            }
        }
        return retext;
    }

    encode(useCtrl, doEncode) {
        console.log("encode")

        if (doEncode) {
            this.Text = this.encodeStr(this.Text);
        }

        if (useCtrl) {
            this.Text = '[#]' + this.Text + "[;]";
        }

        this.width = this.Base.naturalWidth;
        this.height = this.Base.naturalHeight;
        const canvas = createCanvas(this.width, this.height)
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.Base, 0, 0);

        //Image size Validation
        if (this.Text.length > this.width * this.height) {
            console.error('The Image size is too small. Please make  \n Image Width[px]×Image height[px] > ' + this.Text.length);
            exit;
        }

        const beforeTextArr = String(this.Text).split(''); //Each character each array element.
        const imageData = ctx.getImageData(0, 0, this.width, this.height); // Get data of pixel all over the canvas.
        const ImgData = imageData.data;
        let i = 0;


        beforeTextArr.forEach(function(char) {
            let j = 0;
            while (char != this.colorPalet[j][0]) {
                j = j + 1;
                if (j == 16) {
                    j = 0;
                    break;
                }
            }


            const x = i % this.width;
            const y = ((i - x) / this.width);
            const m = ((y * (4 * this.width)) + (x * 4)) | 0;


            //Make BlackPixel white.
            if (ImgData[m + 3] == 0) {
                ImgData[m] = 255;
                ImgData[m + 1] = 255;
                ImgData[m + 2] = 255;
            }

            ImgData[(m + this.mode) | 0] = this.colorPalet[j][1];


            i = (i + 1) | 0;

        }, this)

        imageData.data = ImgData;
        ctx.putImageData(imageData, 0, 0); //Apply changes to the canvas.
        var png = canvas.toDataURL("image/png");
        this.DataUrl = png;
        return (png);

    }

}



let nameco = new Nameco();
nameco.Text = "Hello,World";
loadImage("./sample.png").then(
    (img) => {
        nameco.Base = img;
        const dataUrl = nameco.encode(false, true);

    });
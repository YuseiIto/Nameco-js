'use strict';

const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');
const base64ToImage = require('base64-to-image');

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

        this.Text = "";
        this.DataUrl = "";
        this.img = null;

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

            if (ImgData[m + 3] == 0) {
                ImgData[m + 3] = 255
            }

            i = (i + 1) | 0;

        }, this)

        imageData.data = ImgData;
        ctx.putImageData(imageData, 0, 0); //Apply changes to the canvas.
        var png = canvas.toDataURL("image/png");
        this.DataUrl = png;
        return (png);

    }


    ColorToChr(number) {

        let i = 0;
        while (this.colorPalet[i][1] != number) {
            i = i + 1;
            if (i == 16) {
                i = 15;
                break;
            }
        }
        return this.colorPalet[i][0];
    }


    decodeStr(text) {

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


    decode(useCtrl, doEncode) {

        //img validation
        if (this.img == null) {
            console.error("Input is null. Set a image object to object.img")
        }

        this.width = this.img.naturalWidth;
        this.height = this.img.naturalHeight;
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.img, 0, 0);


        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        let txt = ""; //Text after decode
        let i = 0; //counter
        while (i < (this.width * this.height)) {
            const x = i % this.width; //Decode here(x).
            const y = ((i - x) / this.width); //Decode here (y).
            const m = ((y * (4 * this.width)) + (x * 4)); //Index to access "image data" array
            const c = this.ColorToChr(imageData.data[(m + this.mode)]);
            txt = txt + c;

            i++;
        }


        let resText = txt;
        let text_formed = String(resText).split('[;]');
        if (useCtrl) {
            text_formed = String(text_formed[0]).split('[#]');
        }


        if (doEncode) {
            resText = this.decodeStr(text_formed[1]);
        }

        return resText

    }

}


let nameco = new Nameco();


loadImage("./sample.png").then(
    (img) => {
        nameco.Text = "Ok,Boomer"
        nameco.Base = img;
        const dataUrl = nameco.encode(true, true);
        var optionalObj = { 'fileName': 'encoded', 'type': 'png' };

        base64ToImage(dataUrl, "./", optionalObj);
    })

loadImage("./encoded.png").then((img) => {
    nameco.img = img;
    console.log(nameco.decode(true, true));
})
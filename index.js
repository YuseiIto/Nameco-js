'use strict';

const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

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

        const canvas = createCanvas(this.Base.naturalWidth, this.Base.naturalHeight)

    }

}

let nameco = new Nameco();
nameco.Text = "Hello";
loadImage("./sample.png").then(
    (img) => {
        nameco.Base = img;
        nameco.encode(false, true);
    }
);
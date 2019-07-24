/**
 * @author EthanZhong
 */
import * as EXIF from 'exif-js';

let ImgFile = {
    /**
     * 清除 IOS  照片垂直方向底部的透明区域
     * @param { HTMLImage​Element } img 需要处理的图片
     * @returns { HTMLCanvas​Element​ }
     */
    cleanVTransparent(img) {
        let _iw = img.naturalWidth,
            _ih = img.naturalHeight;
        let _canvas = document.createElement('canvas');
        let _ctx = _canvas.getContext('2d');
        _canvas.width = 1;
        _canvas.height = _ih;
        _ctx.drawImage(img, 0, 0);
        let data = _ctx.getImageData(0, 0, 1, _ih).data;
        let sy = 0,
            ey = _ih,
            py = _ih;

        while (py > sy) {
            let alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        let ratio = py / _ih;
        if (ratio == 0) {
            ratio = 1;
        }
        _ctx.clearRect(0, 0, 1, _ih);
        _canvas.width = _iw;
        _canvas.height = (_ih * ratio) >> 0;
        _ctx.drawImage(img, 0, 0);
        return _canvas;
    },
    /**
     * 根据 orientation 信息把对象扶正
     * @param { HTMLImage​Element|| HTMLCanvas​Element​ } source  需要被扶正的对象
     * @param { Int } orientation  图片拍摄时的方向
     * @returns { HTMLCanvas​Element​ }
     */
    rightOrientation(source, orientation) {
        orientation = parseInt(orientation);
        let _canvas = document.createElement('canvas');
        _canvas.width = source.width;
        _canvas.height = source.height;
        if ([5, 6, 7, 8].includes(orientation)) {
            _canvas.width = source.height;
            _canvas.height = source.width;
        }
        let _ctx = _canvas.getContext('2d');

        switch (orientation) {
            case 2:
                _ctx.translate(_canvas.width, 0);
                _ctx.scale(-1, 1);
                break;
            case 3:
                _ctx.translate(_canvas.width, _canvas.height);
                _ctx.rotate(Math.PI);
                break;
            case 4:
                _ctx.translate(_canvas.width, _canvas.height);
                _ctx.rotate(Math.PI);
                _ctx.translate(_canvas.width, 0);
                _ctx.scale(-1, 1);
                break;
            case 5:
                _ctx.translate(_canvas.width, 0);
                _ctx.rotate(Math.PI / 2);
                _ctx.translate(0, _canvas.width);
                _ctx.scale(1, -1);
                break;
            case 6:
                _ctx.translate(_canvas.width, 0);
                _ctx.rotate(Math.PI / 2);
                break;
            case 7:
                _ctx.translate(0, _canvas.height);
                _ctx.rotate(Math.PI / -2);
                _ctx.translate(0, _canvas.width);
                _ctx.scale(1, -1);
                break;
            case 8:
                _ctx.translate(0, _canvas.height);
                _ctx.rotate(Math.PI / -2);
                break;
        }
        _ctx.drawImage(source, 0, 0);
        return _canvas;
    },
    /**
     * 对选中的图片文件操作
     * @param { File } file 用户选中的图片文件
     * @returns { Promise } 当解决时 then 成功回调可以接受到一个 canvas
     */
    handle(file) {
        let _self = this;
        return new Promise((resolve, reject) => {
            let _reader = new FileReader();
            let _img = document.createElement('img');
            /* 文件读取成功 */
            _reader.onload = (evt) => {
                /* 加载选中的图片 */
                _img.src = evt.target.result;
            }
            /* 文件读取失败 */
            _reader.onerror = (err) => {
                reject(err);
            }
            /* 图片加载成功 */
            _img.onload = () => {
                /* 照片拍摄旋转方向 */
                EXIF.getData(_img, function () {
                    let _orientation = EXIF.getTag(this, 'Orientation');
                    let _withOutTransparent = _self.cleanVTransparent(_img);
                    resolve((typeof _orientation == 'undefined') ? _withOutTransparent : _self.rightOrientation(_withOutTransparent, _orientation));
                });
            }
            /* 图片加载失败 */
            _img.onerror = (err) => {
                reject(err);
            }
            /* 读取 File 文件 */
            _reader.readAsDataURL(file);
        });
    }
};

export { ImgFile };
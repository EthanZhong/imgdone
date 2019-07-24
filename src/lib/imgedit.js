/**
 * @author EthanZhong
 */
import { Vector2d } from './vector2d';

class ImgEdit {
    constructor(canvas, source) {
        this.resetCanvas(canvas);
        this.restSource(source);
        this.reset();
    }
    resetCanvas(canvas) {
        this.canvas = canvas;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.context = canvas.getContext('2d');
        return this;
    }
    restSource(source) {
        this.source = source;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
        this.position = new Vector2d(this.sourceWidth / -2, this.sourceHeight / -2);
        return this;
    }
    reset() {
        this.degree = 0;
        this.minScale = Math.max(this.canvasWidth / this.sourceWidth, this.canvasHeight / this.sourceHeight);
        this.scale = this.minScale;
        return this.render();
    }
    render() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.save();
        this.context.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.context.rotate(ImgEdit.DegToRad(this.degree));
        this.context.scale(this.scale, this.scale);
        this.context.translate(this.position.x, this.position.y);
        this.context.drawImage(this.source, 0, 0);
        this.context.restore();
        return this;
    }
    move(x, y) {
        let _vector2d = new Vector2d(x, y);
        _vector2d.scalar(1 / this.scale).rotate(ImgEdit.DegToRad(-this.degree));
        this.position.add(_vector2d);
        this.render();
    }
    /**
     * 角度转换弧度
     * @param { Number } degree 角度值
     */
    static DegToRad(degree) {
        return degree * Math.PI / 180;
    }
    /**
     * 弧度转换角度
     * @param { Number } radian 弧度值
     */
    static RadToDeg(radian) {
        return radian * 180 / Math.PI;
    }
}

export { ImgEdit };
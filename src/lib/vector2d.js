/**
 * @author EthanZhong
 */
export default class Vector2d {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(vector2d) {
        this.x += vector2d.x;
        this.y += vector2d.y;
        return this;
    }
    subtract(vector2d) {
        this.x -= vector2d.x;
        this.y -= vector2d.y;
        return this;
    }
    scalar(k) {
        this.x *= k;
        this.y *= k;
        return this;
    }
    dot(vector2d) {
        return this.x * vector2d.x + this.y * vector2d.y;
    }
    cross(vector2d) {
        return this.x * vector2d.y - this.y * vector2d.x;
    }
    distance(vector2d) {
        const _x = this.x - vector2d.x;
        const _y = this.y - vector2d.y;
        return Math.sqrt(_x * _x + _y * _y);
    }
    rotate(radian) {
        const _sin = Math.sin(radian);
        const _cos = Math.cos(radian);
        const _x = this.x;
        const _y = this.y;

        this.x = _x * _cos - _y * _sin;
        this.y = _x * _sin + _y * _cos;
        return this;
    }
    copy(vector2d) {
        this.x = vector2d.x;
        this.y = vector2d.y;
        return this;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    clone() {
        return new Vector2d(this.x, this.y);
    }
}
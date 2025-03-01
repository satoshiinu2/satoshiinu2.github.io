"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
var buildTimeStamp;
var isDedicatedServer = (typeof window == 'undefined');
console.log(isDedicatedServer ? "\u001b[32mrunning on server" : "\u001b[32mrunning on client");
if (isDedicatedServer)
    console.log("\u001b[35mCtrl + C to shutdown server\u001b[37m");
var mat4;
if (isDedicatedServer)
    mat4 = require('gl-matrix').mat4;
var vec2;
if (isDedicatedServer)
    vec2 = require('gl-matrix').vec2;
var vec3;
if (isDedicatedServer)
    vec3 = require('gl-matrix').vec3;
var vec4;
if (isDedicatedServer)
    vec4 = require('gl-matrix').vec4;
class vec2Util {
    static add(out, src, x, y = x) {
        return vec2.add(out, src, vec2.fromValues(x, y));
    }
    static sub(out, src, x, y = x) {
        return vec2.sub(out, src, vec2.fromValues(x, y));
    }
    static mul(out, src, x, y = x) {
        return vec2.mul(out, src, vec2.fromValues(x, y));
    }
    static div(out, src, x, y = x) {
        return vec2.div(out, src, vec2.fromValues(x, y));
    }
    static toadd(src, x, y = x) {
        return vec2.add(vec2.create(), src, vec2.fromValues(x, y));
    }
    static tosub(src, x, y = x) {
        return vec2.sub(vec2.create(), src, vec2.fromValues(x, y));
    }
    static tomul(src, x, y = x) {
        return vec2.mul(vec2.create(), src, vec2.fromValues(x, y));
    }
    static todiv(src, x, y = x) {
        return vec2.div(vec2.create(), src, vec2.fromValues(x, y));
    }
    static getX(src) {
        return src[0];
    }
    static getY(src) {
        return src[1];
    }
}
class vec3Util {
    static add(out, src, x, y = x, z = x) {
        return vec3.add(out, src, vec3.fromValues(x, y, z));
    }
    static sub(out, src, x, y = x, z = x) {
        return vec3.sub(out, src, vec3.fromValues(x, y, z));
    }
    static mul(out, src, x, y = x, z = x) {
        return vec3.mul(out, src, vec3.fromValues(x, y, z));
    }
    static div(out, src, x, y = x, z = x) {
        return vec3.div(out, src, vec3.fromValues(x, y, z));
    }
    static toadd(src, x, y = x, z = x) {
        return vec3.add(vec3.create(), src, vec3.fromValues(x, y, z));
    }
    static tosub(src, x, y = x, z = x) {
        return vec3.sub(vec3.create(), src, vec3.fromValues(x, y, z));
    }
    static tomul(src, x, y = x, z = x) {
        return vec3.mul(vec3.create(), src, vec3.fromValues(x, y, z));
    }
    static todiv(src, x, y = x, z = x) {
        return vec3.div(vec3.create(), src, vec3.fromValues(x, y, z));
    }
    static getX(src) {
        return src[0];
    }
    static getY(src) {
        return src[1];
    }
    static getZ(src) {
        return src[2];
    }
    static getXY(src) {
        return vec2.fromValues(src[0], src[2]);
    }
}
class LogColor {
    constructor(code) {
        this.code = code;
    }
    static insert(color, string, start = 0, end = string.length) {
        const temp = Util.stringInsert(string, color.code, start);
        end = Math.max(start, end);
        end += color.code.length;
        return Util.stringInsert(temp, LogColor.WHITE.code, end);
    }
}
LogColor.BLACK = new LogColor("\u001b[30m");
LogColor.RED = new LogColor("\u001b[31m");
LogColor.GREEN = new LogColor("\u001b[32m");
LogColor.YELLOW = new LogColor("\u001b[33m");
LogColor.BLUE = new LogColor("\u001b[34m");
LogColor.MAGENTA = new LogColor("\u001b[35m");
LogColor.CYAN = new LogColor("\u001b[36m");
LogColor.WHITE = new LogColor("\u001b[37m");
class Side {
    equals(other) {
        switch (this) {
            case Side.SERVER: return other instanceof Server;
            case Side.CLIENT: return other instanceof Client;
            default: throw new Error("not side");
        }
    }
    opposite() {
        switch (this) {
            case Side.SERVER: return Side.CLIENT;
            case Side.CLIENT: return Side.SERVER;
            default: throw new Error("not side");
        }
    }
    toString() {
        switch (this) {
            case Side.SERVER: return "SERVER";
            case Side.CLIENT: return "CLIENT";
            default: throw new Error("not side");
        }
    }
}
Side.SERVER = new class extends Side {
};
Side.CLIENT = new class extends Side {
};
// シード付き乱数生成器の実装
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    random() {
        // 線形合同法 (Linear Congruential Generator) を使用
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }
    // 座標 (x, y) をもとにシードを生成
    static generateSeed(...nums) {
        const primes = [73856093, 19349663, 83492791, 1299827, 15485863];
        let seed = 0;
        for (let i = 0; i < nums.length; i++) {
            seed ^= nums[i] * primes[i % primes.length];
        }
        return seed;
    }
}
class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
Color.TRANSPARENT = vec4.fromValues(0, 0, 0, 0);
Color.WHITE = vec4.fromValues(1, 1, 1, 1);
Color.GRAY = vec4.fromValues(0.5, 0.5, 0.5, 1);
Color.BLACK = vec4.fromValues(0, 0, 0, 1);
Color.RED = vec4.fromValues(1, 0, 0, 1);
Color.ORANGE = vec4.fromValues(1, 0.5, 0, 1);
Color.YELLOW = vec4.fromValues(1, 1, 0, 1);
Color.GREEN = vec4.fromValues(0, 1, 0, 1);
Color.CYAN = vec4.fromValues(0, 1, 1, 1);
Color.BLUE = vec4.fromValues(0, 0, 1, 1);
Color.PURPLE = vec4.fromValues(1, 0, 1, 1);
class Facing {
    constructor(index, movedPos) {
        this.index = index;
        this.movedPos = movedPos;
    }
    getOppesite() {
        switch (this) {
            case Facing.EAST: return Facing.WEST;
            case Facing.WEST: return Facing.EAST;
            case Facing.UP: return Facing.DOWN;
            case Facing.DOWN: return Facing.UP;
            case Facing.NORTH: return Facing.SOUTH;
            case Facing.SOUTH: return Facing.NORTH;
            default: throw new Error("not facing");
        }
    }
    getMoved(pos) {
        return vec3.add(vec3.create(), pos, this.movedPos);
    }
    getHorizontalMoved(pos) {
        return vec2.add(vec2.create(), pos, vec2.fromValues(this.movedPos[0], this.movedPos[2]));
    }
    getHorizontalIndex() {
        switch (this) {
            case Facing.EAST: return 0;
            case Facing.WEST: return 1;
            case Facing.NORTH: return 2;
            case Facing.SOUTH: return 3;
            default: throw new Error("not horizontal facing");
        }
    }
}
Facing.EAST = new Facing(0, vec3.fromValues(1, 0, 0));
Facing.WEST = new Facing(1, vec3.fromValues(-1, 0, 0));
Facing.UP = new Facing(2, vec3.fromValues(0, 1, 0));
Facing.DOWN = new Facing(3, vec3.fromValues(0, -1, 0));
Facing.NORTH = new Facing(4, vec3.fromValues(0, 0, 1));
Facing.SOUTH = new Facing(5, vec3.fromValues(0, 0, -1));
class TextureSizeAndDrawSize {
    constructor(textureX, textureY, textureWidth, textureHeight, drawX, drawY, drawWidth, drawHeight) {
        this.texturePos = vec2.fromValues(textureX, textureY);
        this.textureSize = vec2.fromValues(textureWidth, textureHeight);
        this.drawPos = vec2.fromValues(drawX, drawY);
        this.drawSize = vec2.fromValues(drawWidth, drawHeight);
    }
}
class TexturesRegistry extends Map {
    get(key) {
        var _d;
        if (this.fallbackTexture == null)
            throw Error("called texture before initraize");
        return (_d = super.get(key)) !== null && _d !== void 0 ? _d : this.fallbackTexture;
    }
    setFallBackTexture(texture) {
        this.fallbackTexture = texture;
    }
}
class NineSliceSprite {
    constructor(nineSliceSize, baseSize, texturePos) {
        this.nineSliceSize = nineSliceSize;
        this.baseSize = baseSize;
        this.texturePos = texturePos;
    }
}
const textures = new TexturesRegistry;
class Texture {
    constructor(width, height, front, back = front, top = front, bottom = front, right = front, left = front) {
        this.width = width;
        this.height = height;
        this.front = front;
        this.back = back;
        this.top = top;
        this.bottom = bottom;
        this.right = right;
        this.left = left;
    }
}
class TextureCube {
    static getFrontUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX + cubeDepth, posY + cubeDepth, posX + cubeDepth + cubeWidth, posY + cubeDepth + cubeHeight);
    }
    static getBackUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX + cubeDepth + cubeWidth + cubeDepth, posY + cubeDepth, posX + cubeDepth + cubeWidth + cubeDepth + cubeWidth, posY + cubeDepth + cubeHeight);
    }
    static getTopUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX + cubeDepth, posY, posX + cubeDepth + cubeWidth, posY + cubeDepth);
    }
    static getBottomUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX + cubeDepth + cubeWidth, posY, posX + cubeDepth + cubeWidth + cubeWidth, posY + cubeDepth);
    }
    static getRightUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX, posY + cubeDepth, posX + cubeDepth, posY + cubeDepth + cubeHeight);
    }
    static getLeftUV(posX, posY, cubeWidth, cubeHeight, cubeDepth) {
        return new TextureUV(posX + cubeDepth + cubeWidth, posY + cubeDepth, posX + cubeDepth + cubeWidth + cubeDepth, posY + cubeDepth + cubeHeight);
    }
    static of(width, height, posX, posY, cubeWidth, cubeHeight, cubeDepth, isMirrored = false) {
        let back, front, bottom, top, left, right;
        if (isMirrored) {
            back = this.getFrontUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            front = this.getBackUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            bottom = this.getTopUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            top = this.getBottomUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            left = this.getRightUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            right = this.getLeftUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
        }
        else {
            front = this.getFrontUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            back = this.getBackUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            top = this.getTopUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            bottom = this.getBottomUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            right = this.getRightUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
            left = this.getLeftUV(posX, posY, cubeWidth, cubeHeight, cubeDepth);
        }
        return new Texture(width, height, front, back, top, bottom, right, left);
    }
}
class RotationPointContext {
    constructor(pitch, yaw, roll, rotateCenter) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.roll = roll;
        this.rotateCenter = rotateCenter;
    }
}
class Cube {
    constructor(x0, y0, z0, x1, y1, z1, textureFront = 0, textureBack = textureFront, textureTop = textureFront, textureBottom = textureFront, textureRight = textureFront, textureLeft = textureFront) {
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;
        this.rotateCenter = vec3.fromValues(0, 0, 0);
        this.rotatePoints = new Array;
        this.x0 = x0;
        this.y0 = y0;
        this.z0 = z0;
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.textureFront = textureFront;
        this.textureBack = textureBack;
        this.textureTop = textureTop;
        this.textureBottom = textureBottom;
        this.textureRight = textureRight;
        this.textureLeft = textureLeft;
    }
    getTextures() {
        return [this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft];
    }
    setTexture(width, height, posX, posY, mirrored = false) {
        this.texture = TextureCube.of(width, height, posX, posY, this.x1 - this.x0, this.y1 - this.y0, this.z1 - this.z0, mirrored);
        return this;
    }
    copyTexture(texture) {
        this.texture = texture;
        return this;
    }
    // texture = new Texture(256, 256, 64, 64, 16, 16, 16);
    toMoved(xa, ya, za) {
        return new Cube(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 + xa, this.y1 + ya, this.z1 + za, this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft)
            .copyTexture(this.texture)
            .setThisRotate(this.pitch, this.yaw, this.roll, this.rotateCenter[0] + xa, this.rotateCenter[1] + ya, this.rotateCenter[2] + za)
            .copyThisRotate(this.rotatePoints, center => vec3.fromValues(center[0] + xa, center[1] + ya, center[2] + za));
    }
    toScaled(xa, ya, za) {
        return new Cube(this.x0 * xa, this.y0 * ya, this.z0 * za, this.x1 * xa, this.y1 * ya, this.z1 * za, this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft)
            .copyTexture(this.texture)
            .setThisRotate(this.pitch, this.yaw, this.roll, this.rotateCenter[0] * xa, this.rotateCenter[1] * ya, this.rotateCenter[2] * za)
            .copyThisRotate(this.rotatePoints, center => vec3.fromValues(center[0] * xa, center[1] * ya, center[2] * za));
    }
    toScaledWithCenter(xa, ya, za, xo, yo, zo) {
        return new Cube((this.x0 - xo) * xa + xo, (this.y0 - yo) * ya + yo, (this.z0 - zo) * za + zo, (this.x1 - xo) * xa + xo, (this.y1 - yo) * ya + yo, (this.z1 - zo) * za + zo, this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft)
            .copyTexture(this.texture)
            .setThisRotate(this.pitch, this.yaw, this.roll, (this.rotateCenter[0] - xo) * xa + xo, (this.rotateCenter[1] - yo) * ya + yo, (this.rotateCenter[2] - zo) * za + zo);
    }
    setThisRotate(pitchDeg, yawDeg, rollDeg, rotateCenterX = 0, rotateCenterY = 0, rotateCenterZ = 0) {
        this.pitch = pitchDeg;
        this.yaw = yawDeg;
        this.roll = rollDeg;
        this.rotateCenter = vec3.fromValues(rotateCenterX, rotateCenterY, rotateCenterZ);
        return this;
    }
    setThisRotateCenter(rotateCenter) {
        this.rotateCenter = rotateCenter;
        return this;
    }
    addThisRotate(pitchDeg, yawDeg, rollDeg, rotateCenterX = 0, rotateCenterY = 0, rotateCenterZ = 0) {
        this.rotatePoints.push(new RotationPointContext(pitchDeg, yawDeg, rollDeg, vec3.fromValues(rotateCenterX, rotateCenterY, rotateCenterZ)));
        return this;
    }
    copyThisRotate(rotatePoints, modifyCallBack) {
        this.rotatePoints = rotatePoints.map(point => { point.rotateCenter = modifyCallBack(point.rotateCenter); return point; });
        return this;
    }
    getCenter() {
        return vec3.fromValues((this.x1 + this.x0) / 2, (this.y1 + this.y0) / 2, (this.z1 + this.z0) / 2);
    }
    getHalfSize() {
        return vec3.fromValues((this.x1 - this.x0) / 2, (this.y1 - this.y0) / 2, (this.z1 - this.z0) / 2);
    }
    getVertices() {
        const vertices = new Array;
        const { x0: x0, y0: y0, z0: z0, x1: x1, y1: y1, z1: z1 } = this; //.toScaledWithCenter(1 / 16, 1 / 16, 1 / 16, this.getCenter()[0], this.getCenter()[1], this.getCenter()[2]);
        const textures = this.getTextures();
        for (const index in textures) {
            if (textures[index] == -1)
                continue;
            switch (+index) {
                case 0:
                    // 前面
                    vertices.push(vec3.fromValues(x0, y0, z1), vec3.fromValues(x1, y0, z1), vec3.fromValues(x1, y1, z1), vec3.fromValues(x0, y1, z1));
                    break;
                case 1:
                    // 背面
                    vertices.push(vec3.fromValues(x0, y0, z0), vec3.fromValues(x0, y1, z0), vec3.fromValues(x1, y1, z0), vec3.fromValues(x1, y0, z0));
                    break;
                case 2:
                    // 上面
                    vertices.push(vec3.fromValues(x0, y1, z0), vec3.fromValues(x0, y1, z1), vec3.fromValues(x1, y1, z1), vec3.fromValues(x1, y1, z0));
                    break;
                case 3:
                    // 底面
                    vertices.push(vec3.fromValues(x0, y0, z0), vec3.fromValues(x1, y0, z0), vec3.fromValues(x1, y0, z1), vec3.fromValues(x0, y0, z1));
                    break;
                case 4:
                    // 右側面
                    vertices.push(vec3.fromValues(x1, y0, z0), vec3.fromValues(x1, y1, z0), vec3.fromValues(x1, y1, z1), vec3.fromValues(x1, y0, z1));
                    break;
                case 5:
                    // 左側面
                    vertices.push(vec3.fromValues(x0, y0, z0), vec3.fromValues(x0, y0, z1), vec3.fromValues(x0, y1, z1), vec3.fromValues(x0, y1, z0));
                    break;
            }
        }
        return vertices;
    }
    getRotatedVertcies() {
        const finalVertices = new Array;
        const rotationMat = Renderer.rotationMatrix(this.pitch, this.yaw, this.roll);
        const rotatedVertices = this.getVertices().map(vertex => Renderer.rotatePointAroundCenter(vertex, rotationMat, this.getCenter()));
        for (const point of this.rotatePoints) {
            const rotationMat = Renderer.rotationMatrix(point.pitch, point.yaw, point.roll);
            const center = point.rotateCenter;
            for (let i = 0; i < rotatedVertices.length; i++) {
                rotatedVertices[i] = Renderer.rotatePointAroundCenter(rotatedVertices[i], rotationMat, center);
            }
        }
        for (const vertex of rotatedVertices) {
            finalVertices.push(...vertex);
        }
        return finalVertices;
    }
    getTextureUVs() {
        const textureCoordinates = new Array;
        if (this.texture == null)
            return textureCoordinates;
        const defUV = new TextureUV(0, 0, 1, 1);
        const { x0: x0, y0: y0, z0: z0, x1: x1, y1: y1, z1: z1 } = this;
        const { front: front, back: back, top: top, bottom: bottom, right: right, left: left } = this.texture;
        const isRepeatTexture = this instanceof CubeTile; // deprecated
        let xs = 1;
        let ys = 1;
        let zs = 1;
        if (isRepeatTexture) {
            xs = x1 - x0;
            ys = y1 - y0;
            zs = z1 - z0;
        }
        const textures = this.getTextures();
        for (const index in textures) {
            if (textures[index] == -1)
                continue;
            switch (+index) {
                case 0:
                    // 前面
                    const uv0 = front == null || isRepeatTexture ? defUV : front.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv0.x0, -uv0.y1 * ys, uv0.x1 * xs, -uv0.y1 * ys, uv0.x1 * xs, -uv0.y0, uv0.x0, -uv0.y0);
                    break;
                case 1:
                    // 背面
                    const uv1 = back == null || isRepeatTexture ? defUV : back.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv1.x1 * xs, -uv1.y1 * ys, uv1.x1 * xs, -uv1.y0, uv1.x0, -uv1.y0, uv1.x0, -uv1.y1 * ys);
                    break;
                case 2:
                    // 上面
                    const uv2 = top == null || isRepeatTexture ? defUV : top.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv2.x1 * xs, -uv2.y1 * zs, uv2.x1 * xs, -uv2.y0, uv2.x0, -uv2.y0, uv2.x0, -uv2.y1 * zs);
                    break;
                case 3:
                    // 下面
                    const uv3 = bottom == null || isRepeatTexture ? defUV : bottom.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv3.x0, -uv3.y1 * zs, uv3.x1 * xs, -uv3.y1 * zs, uv3.x1 * xs, -uv3.y0, uv3.x0, -uv3.y0);
                    break;
                case 4:
                    // 右面
                    const uv4 = right == null || isRepeatTexture ? defUV : right.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv4.x1 * zs, -uv4.y1 * ys, uv4.x1 * zs, -uv4.y0, uv4.x0, -uv4.y0, uv4.x0, -uv4.y1 * ys);
                    break;
                case 5:
                    // 左面
                    const uv5 = left == null || isRepeatTexture ? defUV : left.getUV0to1(this.texture.width, this.texture.height);
                    textureCoordinates.push(uv5.x0, -uv5.y1 * ys, uv5.x1 * zs, -uv5.y1 * ys, uv5.x1 * zs, -uv5.y0, uv5.x0, -uv5.y0);
                    break;
            }
        }
        return textureCoordinates;
    }
    getTextureVarious() {
        const textureVarious = new Array;
        const textures = this.getTextures();
        for (const texture of textures) {
            if (texture == -1)
                continue;
            textureVarious.push(texture, 0, texture, 0, texture, 0, texture, 0);
        }
        return textureVarious;
    }
    getTextureIndices(offset) {
        const textureIndices = new Array;
        const textures = this.getTextures();
        for (const texture of textures) {
            if (texture == -1)
                continue;
            textureIndices.push(...[0, 1, 2, 0, 2, 3].map(value => value + offset));
            offset += 4;
        }
        return textureIndices;
    }
}
class TextureUV {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    }
    mirrored(isMirrored = true) {
        if (!isMirrored)
            return new TextureUV(this.x0, this.y0, this.x1, this.y1);
        return new TextureUV(this.x1, this.y1, this.x0, this.y0);
    }
    devide(x, y) {
        return y == 0 ? 0 : x / y;
    }
    getUV0to1(width, height) {
        return new TextureUV(this.devide(this.x0, width), this.devide(this.y0, width), this.devide(this.x1, height), this.devide(this.y1, height));
    }
}
class CubeTile extends Cube {
    constructor() {
        super(...arguments);
        this.texture = new Texture(256, 256, new TextureUV(0, 0, 16, 16));
    }
    static getFilteredTextures(textures, filterBits) {
        // if (true) return textures;
        const disabledTexture = -1;
        return textures.map((orignalTexture, index) => filterBits & (Math.pow(2, (5 - index))) ? orignalTexture : disabledTexture);
    }
    toMoved(xa, ya, za) {
        return new CubeTile(this.x0 + xa, this.y0 + ya, this.z0 + za, this.x1 + xa, this.y1 + ya, this.z1 + za, this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft).copyTexture(this.texture);
    }
    toScaled(xa, ya, za) {
        return new CubeTile(this.x0 * xa, this.y0 * ya, this.z0 * za, this.x1 * xa, this.y1 * ya, this.z1 * za, this.textureFront, this.textureBack, this.textureTop, this.textureBottom, this.textureRight, this.textureLeft).copyTexture(this.texture);
    }
}
CubeTile.textureStoneFloor = [
    0, 0, 0, 0, 0, 0
];
CubeTile.textureStoneWall = [
    1, 1, 1, 1, 1, 1
];
class CubePlayerHead extends Cube {
    constructor() {
        super(...arguments);
        this.texture = new class {
            constructor() {
                this.front = new TextureUV(16, 16, 32, 32);
                this.back = new TextureUV(48, 16, 64, 32);
                this.top = new TextureUV(16, 0, 32, 16);
                this.bottom = new TextureUV(32, 0, 48, 16);
                this.right = new TextureUV(0, 16, 16, 32);
                this.left = new TextureUV(32, 16, 48, 32);
                this.width = 64;
                this.height = 64;
            }
        };
    }
}
class CubeOctopusHead extends Cube {
    constructor() {
        super(...arguments);
        this.texture = new class {
            constructor() {
                this.front = new TextureUV(16, 16, 32, 32);
                this.back = new TextureUV(48, 16, 64, 32);
                this.top = new TextureUV(16, 0, 32, 16);
                this.bottom = new TextureUV(32, 0, 48, 16);
                this.right = new TextureUV(0, 16, 16, 32);
                this.left = new TextureUV(32, 16, 48, 32);
                this.width = 64;
                this.height = 64;
            }
        };
    }
}
class CubeOctopusNose extends Cube {
    constructor() {
        super(...arguments);
        this.texture = new class {
            constructor() {
                this.front = new TextureUV(16, 56, 24, 64);
                this.back = new TextureUV(24, 56, 32, 64);
                this.top = new TextureUV(16, 40, 24, 56);
                this.bottom = new TextureUV(24, 40, 32, 56);
                this.right = new TextureUV(0, 56, 16, 64);
                this.left = new TextureUV(32, 56, 48, 64);
                this.width = 64;
                this.height = 64;
            }
        };
    }
}
class CubeEnemyBody extends Cube {
    constructor() {
        super(...arguments);
        this.texture = new class {
            constructor() {
                this.front = new TextureUV(16, 16, 32, 32);
                this.back = new TextureUV(48, 16, 64, 32);
                this.top = new TextureUV(16, 0, 32, 16);
                this.bottom = new TextureUV(32, 0, 48, 16);
                this.right = new TextureUV(0, 16, 16, 32);
                this.left = new TextureUV(32, 16, 48, 32);
                this.width = 64;
                this.height = 64;
            }
        };
    }
}
class AABB {
    constructor(x0, y0, z0, x1, y1, z1) {
        this.x0 = x0;
        this.y0 = y0;
        this.z0 = z0;
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
    }
    set(x0, y0, z0, x1, y1, z1) {
        this.x0 = x0;
        this.y0 = y0;
        this.z0 = z0;
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
    }
    expand(xa, ya, za) {
        let _x0 = this.x0;
        let _y0 = this.y0;
        let _z0 = this.z0;
        let _x1 = this.x1;
        let _y1 = this.y1;
        let _z1 = this.z1;
        if (xa < 0)
            _x0 + xa;
        if (xa > 0)
            _x1 + xa;
        if (ya < 0)
            _y0 + ya;
        if (ya > 0)
            _y1 + ya;
        if (za < 0)
            _z0 + za;
        if (za > 0)
            _z1 + za;
        return new AABB(_x0, _y0, _z0, _x1, _y1, _z1);
    }
    toMoved(xa, ya, za) {
        let _x0 = this.x0;
        let _y0 = this.y0;
        let _z0 = this.z0;
        let _x1 = this.x1;
        let _y1 = this.y1;
        let _z1 = this.z1;
        _x0 += xa;
        _x1 += xa;
        _y0 += ya;
        _y1 += ya;
        _z0 += za;
        _z1 += za;
        return new AABB(_x0, _y0, _z0, _x1, _y1, _z1);
    }
    scale(s = 1) {
        let _x0 = this.x0;
        let _y0 = this.y0;
        let _z0 = this.z0;
        let _x1 = this.x1;
        let _y1 = this.y1;
        let _z1 = this.z1;
        return new AABB(_x0 * s, _y0 * s, _z0 * s, _x1 * s, _y1 * s, _z1 * s);
    }
    move(xa, ya, za) {
        this.x0 += xa;
        this.y0 += ya;
        this.z0 += za;
        this.x1 += xa;
        this.y1 += ya;
        this.z1 += za;
        return this;
    }
    initBySize(size) {
        this.x0 = -size[0] / 2;
        this.y0 = 0;
        this.z0 = -size[0] / 2;
        this.x1 = size[0] / 2;
        this.y1 = size[1];
        this.z1 = size[0] / 2;
        return this;
    }
    clipXCollide(c, xa) {
        if (c.y1 <= this.y0 || c.y0 >= this.y1)
            return xa;
        if (c.z1 <= this.z0 || c.z0 >= this.z1)
            return xa;
        if (xa > 0.0 && c.x1 <= this.x0) {
            let max = this.x0 - c.x1;
            if (max < xa)
                xa = max;
        }
        if (xa < 0.0 && c.x0 >= this.x1) {
            let max = this.x1 - c.x0;
            if (max > xa)
                xa = max;
        }
        return xa;
    }
    clipYCollide(c, ya) {
        if (c.x1 <= this.x0 || c.x0 >= this.x1)
            return ya;
        if (c.z1 <= this.z0 || c.z0 >= this.z1)
            return ya;
        if (ya > 0.0 && c.y1 <= this.y0) {
            let max = this.y0 - c.y1;
            if (max < ya)
                ya = max;
        }
        if (ya < 0.0 && c.y0 >= this.y1) {
            let max = this.y1 - c.y0;
            if (max > ya)
                ya = max;
        }
        return ya;
    }
    clipZCollide(c, za) {
        if (c.x1 <= this.x0 || c.x0 >= this.x1)
            return za;
        if (c.y1 <= this.y0 || c.y0 >= this.y1)
            return za;
        if (za > 0.0 && c.z1 <= this.z0) {
            let max = this.z0 - c.z1;
            if (max < za)
                za = max;
        }
        if (za < 0.0 && c.z0 >= this.z1) {
            let max = this.z1 - c.z0;
            if (max > za)
                za = max;
        }
        return za;
    }
    overlap(other) {
        return !(this.x0 > other.x1 ||
            this.x1 < other.x0 ||
            this.y0 > other.y1 ||
            this.y1 < other.y0 ||
            this.z0 > other.z1 ||
            this.z1 < other.z0);
    }
}
// if(value ? false : value ?? true)
// if(value == null)
// which is better?
class ReverseRegistry {
    constructor() {
        this.registry = new Map();
        this.registryReverse = new Map();
    }
    getByKey(key) {
        return this.registry.get(key);
    }
    getByValue(value) {
        return this.registryReverse.get(value);
    }
    hasKey(key) {
        return this.registry.has(key);
    }
    hasValue(value) {
        return this.registryReverse.has(value);
    }
    register(key, value) {
        this.registry.set(key, value);
        this.registryReverse.set(value, key);
        return value;
    }
}
class ParticlesList extends Array {
    removeByInstance(particleIn) {
        if (particleIn == null)
            return false;
        return !!this.splice(this.indexOf(particleIn), 1);
    }
}
class AbsEntitiesList extends Array {
    getByUUID(uuid) {
        return this.find(e => e.uuid === uuid);
    }
    hasUUID(uuid) {
        return this.some(e => e.uuid === uuid);
    }
    removeByUUID(uuid) {
        const entity = this.getByUUID(uuid);
        if (entity == null)
            return false;
        return this.removeByInstance(entity);
    }
    removeByInstance(entityIn) {
        if (entityIn == null)
            return false;
        return !!this.splice(this.indexOf(entityIn), 1);
    }
    copy() {
        return this.copyWithin(0, 0);
    }
    hurtAll(damage, attacker, gameIn) {
        let count = 0;
        this.forEach(e => e != attacker && e.isAlive() && e instanceof EntityLiving && (count += e.hurt(damage, attacker, gameIn) ? 1 : 0));
        return count > 0;
    }
}
class EntitiesList extends AbsEntitiesList {
    filter(predicate, thisArg) {
        return new EntitiesList(...super.filter(predicate, thisArg));
    }
    getCollideWith(aabb) {
        return this.filter(e => e.bb != null && e.bb.overlap(aabb));
    }
    getOnlyClasses(...classes) {
        return this.filter(e => classes.some(f => e instanceof f));
    }
    getOnlyClass(class_) {
        return this.filter(e => e instanceof class_);
    }
    getPlayers() {
        return new PlayerList(...super.filter(e => e instanceof EntityPlayer)); // call array filter method
    }
}
class PlayerList extends AbsEntitiesList {
    filter(predicate, thisArg) {
        return new PlayerList(...super.filter(predicate, thisArg));
    }
    getCollideWith(aabb) {
        return this.filter(e => e.bb != null && e.bb.overlap(aabb));
    }
    getOnlyClass(...classes) {
        return this.filter(e => classes.some(f => e instanceof f));
    }
}
class PerformanceTester {
    Start() {
        this.startTime = performance.now();
    }
    End() {
        this.endTime = performance.now();
        this.Time = Math.floor(this.endTime - this.startTime);
        this.countEndTime = performance.now();
        this.count++;
        if (this.countEndTime - this.countStartTime >= 1000 || isNaN(this.countStartTime)) {
            this.frameParSec = this.count;
            this.count = 0;
            this.countStartTime = performance.now();
        }
    }
    constructor() {
        this.startTime = NaN;
        this.endTime = NaN;
        this.Time = NaN;
        this.frameParSec = NaN;
        this.countStartTime = NaN;
        this.countEndTime = NaN;
        this.count = NaN;
        this.Start();
    }
}
const serverTickPerf = new PerformanceTester;
const clientTickPerf = new PerformanceTester;
const clientFlamePerf = new PerformanceTester;
var levelEventType;
(function (levelEventType) {
    levelEventType[levelEventType["SPAWN_KILL_EFFECT"] = 1] = "SPAWN_KILL_EFFECT";
})(levelEventType || (levelEventType = {}));
class PacketTypeUtil {
    static requireNonNullOrUndefined(value, errorMsg = "invalid data type which is null or undefined") { if (value == null)
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireUUID(value, errorMsg = "invalid data type which is not uuid") { if (!TypeUtil.isUUID(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireBoolean(value, errorMsg = "invalid data type which is not string") { if (!TypeUtil.isBoolean(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireString(value, errorMsg = "invalid data type which is not string") { if (!TypeUtil.isString(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireNumber(value, errorMsg = "invalid data type which is not number") { if (!TypeUtil.isNumber(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireFiniteNumber(value, errorMsg = "invalid data type which is not finite number") { if (!TypeUtil.isFiniteNumber(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireNumberArray(value, errorMsg = "invalid data type which is not number array") { if (!TypeUtil.isNumberArray(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireFiniteNumberArray(value, errorMsg = "invalid data type which is not finite number array") { if (!TypeUtil.isFiniteNumberArray(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireArray(value, errorMsg = "invalid data type which is not array") { if (!Array.isArray(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
    static requireNonArray(value, errorMsg = "invalid data type which is array") { if (Array.isArray(value))
        throw new PacketException(errorMsg, value); return value; }
    ;
}
class PacketException extends Error {
    constructor(msg, ...addtionalMsg) {
        super(msg + " " + addtionalMsg.join(" "));
        this.msg = msg;
        this.addtionalMsg = addtionalMsg;
    }
    trace(packet) {
        console.error("packetException", this.msg, ...this.addtionalMsg, packet);
        console.trace(this);
    }
}
class PacketSideContext {
    constructor(gameIn, serverClient) {
        this.gameIn = gameIn;
        this.serverClient = serverClient;
        if (gameIn instanceof Server && serverClient == null)
            throw Error("serverClient not set");
    }
    getGame() {
        return this.gameIn;
    }
    getServerClient() {
        return this.serverClient;
    }
}
class PacketRegistry extends ReverseRegistry {
    getByPacket(packet) {
        const packetClass = packet.constructor;
        return this.getByValue(packetClass);
    }
}
class DelayPacketContext {
    constructor(packet, ctx) {
        this.packet = packet;
        this.ctx = ctx;
    }
}
class DataViewExtend extends DataView {
    constructor(buffer, byteOffset, byteLength) {
        super(buffer, byteOffset, byteLength);
        this.index = 0;
    }
    checkBounds(byteOffset, byteLength) {
        if (byteOffset < 0 || byteOffset + byteLength > this.byteLength) {
            throw new PacketException("Index out of bounds", byteOffset, byteLength);
        }
    }
    incrementIndex(index = 1) {
        this.index += index;
    }
    setIndex(index) {
        this.index = index;
    }
    writeFloat32(value, littleEndian) {
        this.checkBounds(this.index, Float32Array.BYTES_PER_ELEMENT);
        super.setFloat32(this.index, value, littleEndian);
        this.incrementIndex(Float32Array.BYTES_PER_ELEMENT);
    }
    writeFloat64(value, littleEndian) {
        this.checkBounds(this.index, Float64Array.BYTES_PER_ELEMENT);
        super.setFloat64(this.index, value, littleEndian);
        this.incrementIndex(Float64Array.BYTES_PER_ELEMENT);
    }
    writeInt8(value) {
        this.checkBounds(this.index, Int8Array.BYTES_PER_ELEMENT);
        super.setInt8(this.index, value);
        this.incrementIndex(Int8Array.BYTES_PER_ELEMENT);
    }
    writeInt16(value, littleEndian) {
        this.checkBounds(this.index, Int16Array.BYTES_PER_ELEMENT);
        super.setInt16(this.index, value);
        this.incrementIndex(Int16Array.BYTES_PER_ELEMENT);
    }
    writeInt32(value, littleEndian) {
        this.checkBounds(this.index, Int32Array.BYTES_PER_ELEMENT);
        super.setInt32(this.index, value);
        this.incrementIndex(Int32Array.BYTES_PER_ELEMENT);
    }
    writeUint8(value) {
        this.checkBounds(this.index, Uint8Array.BYTES_PER_ELEMENT);
        super.setUint8(this.index, value);
        this.incrementIndex(Uint8Array.BYTES_PER_ELEMENT);
    }
    writeUint16(value, littleEndian) {
        this.checkBounds(this.index, Uint16Array.BYTES_PER_ELEMENT);
        super.setUint16(this.index, value);
        this.incrementIndex(Uint16Array.BYTES_PER_ELEMENT);
    }
    writeUint32(value, littleEndian) {
        this.checkBounds(this.index, Uint32Array.BYTES_PER_ELEMENT);
        super.setUint32(this.index, value);
        this.incrementIndex(Uint32Array.BYTES_PER_ELEMENT);
    }
    writeBigInt64(value, littleEndian) {
        this.checkBounds(this.index, BigInt64Array.BYTES_PER_ELEMENT);
        super.setBigInt64(this.index, value, littleEndian);
        this.incrementIndex(BigInt64Array.BYTES_PER_ELEMENT);
    }
    writeBigUint64(value, littleEndian) {
        this.checkBounds(this.index, BigUint64Array.BYTES_PER_ELEMENT);
        super.setBigUint64(this.index, value, littleEndian);
        this.incrementIndex(BigUint64Array.BYTES_PER_ELEMENT);
    }
    readBigInt64(littleEndian) {
        this.checkBounds(this.index, BigInt64Array.BYTES_PER_ELEMENT);
        const data = super.getBigInt64(this.index, littleEndian);
        this.incrementIndex(BigInt64Array.BYTES_PER_ELEMENT);
        return data;
    }
    readBigUint64(littleEndian) {
        this.checkBounds(this.index, BigUint64Array.BYTES_PER_ELEMENT);
        const data = super.getBigUint64(this.index, littleEndian);
        this.incrementIndex(BigUint64Array.BYTES_PER_ELEMENT);
        return data;
    }
    readFloat32(littleEndian) {
        this.checkBounds(this.index, Float32Array.BYTES_PER_ELEMENT);
        const data = super.getFloat32(this.index, littleEndian);
        this.incrementIndex(Float32Array.BYTES_PER_ELEMENT);
        return data;
    }
    readFloat64(littleEndian) {
        this.checkBounds(this.index, Float64Array.BYTES_PER_ELEMENT);
        const data = super.getFloat64(this.index, littleEndian);
        this.incrementIndex(Float64Array.BYTES_PER_ELEMENT);
        return data;
    }
    readInt8() {
        this.checkBounds(this.index, Int8Array.BYTES_PER_ELEMENT);
        const data = super.getInt8(this.index);
        this.incrementIndex(Int8Array.BYTES_PER_ELEMENT);
        return data;
    }
    readInt16(littleEndian) {
        this.checkBounds(this.index, Int16Array.BYTES_PER_ELEMENT);
        const data = super.getInt16(this.index, littleEndian);
        this.incrementIndex(Int16Array.BYTES_PER_ELEMENT);
        return data;
    }
    readInt32(littleEndian) {
        this.checkBounds(this.index, Int32Array.BYTES_PER_ELEMENT);
        const data = super.getInt32(this.index, littleEndian);
        this.incrementIndex(Int32Array.BYTES_PER_ELEMENT);
        return data;
    }
    readUint8() {
        this.checkBounds(this.index, Uint8Array.BYTES_PER_ELEMENT);
        const data = super.getUint8(this.index);
        this.incrementIndex(Uint8Array.BYTES_PER_ELEMENT);
        return data;
    }
    readUint16(littleEndian) {
        this.checkBounds(this.index, Uint16Array.BYTES_PER_ELEMENT);
        const data = super.getUint16(this.index, littleEndian);
        this.incrementIndex(Uint16Array.BYTES_PER_ELEMENT);
        return data;
    }
    readUint32(littleEndian) {
        this.checkBounds(this.index, Uint32Array.BYTES_PER_ELEMENT);
        const data = super.getUint32(this.index, littleEndian);
        this.incrementIndex(Uint32Array.BYTES_PER_ELEMENT);
        return data;
    }
}
class PacketHandler {
    constructor(gameIn, selfSideRegistry, targetSideRegistry) {
        this.gameIn = gameIn;
        this.selfSideRegistry = selfSideRegistry;
        this.targetSideRegistry = targetSideRegistry;
        this.delayedPacket = [];
        this.isDelayPacketHandling = false;
        this.delayPackets = new Set;
    }
    createPacket(view) {
        const packetId = view.readUint8();
        const packetClass = this.selfSideRegistry.getByKey(packetId);
        if (packetClass == null)
            throw new PacketException("invalid packet id", packetId, this.getRegistrySideName(this.selfSideRegistry) + "reg");
        const packet = new packetClass;
        packet.recieved(view);
        return packet;
    }
    getJsonByPacket(packet) {
        try {
            const packetClass = packet.constructor;
            const packetId = this.targetSideRegistry.getByPacket(packet);
            if (packetId == null)
                throw new PacketException("invalid packet class", packetClass.name, this.getRegistrySideName(this.targetSideRegistry) + "reg");
            const buf = new ArrayBuffer(Int8Array.BYTES_PER_ELEMENT + packet.getLength());
            const view = new DataViewExtend(buf);
            view.writeUint8(packetId);
            return packet.getMessage(view);
        }
        catch (e) {
            if (e instanceof PacketException)
                this.gameIn.onPacketExceptionOrError(e);
            else
                throw e;
        }
        const buf = new ArrayBuffer(0);
        return new DataViewExtend(buf);
    }
    tick() {
        this.isDelayPacketHandling = true;
        for (const packetCtx of this.delayPackets) {
            packetCtx.packet.handle(packetCtx.ctx);
        }
        this.delayPackets.clear();
        this.isDelayPacketHandling = false;
    }
    tryHandle(packet, ctx) {
        if ("shouldDelayPacket" in packet && packet.shouldDelayPacket) {
            if (this.isDelayPacketHandling)
                console.warn("delay packet added queue while handling delay packet");
            this.delayPackets.add(new DelayPacketContext(packet, ctx));
            return;
        }
        packet.handle(ctx);
    }
    getRegistrySideName(registry) {
        switch (registry) {
            case PacketHandler.ServerRegistry: return "server";
            case PacketHandler.ClientRegistry: return "client";
            default: return "unknown";
        }
    }
    static initPacket() {
        PacketHandler.ServerRegistry.register(0x00, PacketToServerPlayerJoin);
        PacketHandler.ServerRegistry.register(0x01, PacketToServerPlayerRespawn);
        PacketHandler.ServerRegistry.register(0x10, PacketToServerPlayerMove);
        PacketHandler.ServerRegistry.register(0xf0, PacketToServerPlayerDataSync);
        PacketHandler.ServerRegistry.register(0xf1, PacketToServerPlayerEventSync);
        PacketHandler.ServerRegistry.register(0xf8, PacketToServerLevelDataSync);
        PacketHandler.ServerRegistry.register(0xf9, PacketToServerLevelEventSync);
        PacketHandler.ClientRegistry.register(0x00, PacketToClientLogin);
        PacketHandler.ClientRegistry.register(0x01, PacketToClientEntityCreate);
        PacketHandler.ClientRegistry.register(0x02, PacketToClientOtherPlayerCreate);
        PacketHandler.ClientRegistry.register(0x03, PacketToClientEntityDiscard);
        PacketHandler.ClientRegistry.register(0x10, PacketToClientEntityMove);
        PacketHandler.ClientRegistry.register(0x11, PacketToClientEntityVelocity);
        PacketHandler.ClientRegistry.register(0x20, PacketToClientUpdatePlayerData);
        PacketHandler.ClientRegistry.register(0x21, PacketToClientDeletePlayerData);
        PacketHandler.ClientRegistry.register(0x22, PacketToClientHurtAnimation);
        PacketHandler.ClientRegistry.register(0xf0, PacketToClientEntityDataSync);
        PacketHandler.ClientRegistry.register(0xf1, PacketToClientEntityEventSync);
        PacketHandler.ClientRegistry.register(0xf8, PacketToClientLevelDataSync);
        PacketHandler.ClientRegistry.register(0xf9, PacketToClientLevelEventSync);
        // console.log("packet registry initialized")
    }
}
PacketHandler.ServerRegistry = new PacketRegistry();
PacketHandler.ClientRegistry = new PacketRegistry();
class PacketToServerPlayerJoin {
    constructor(userName = "") {
        this.userName = userName;
    }
    getMessage(view) {
        DataViewUtil.writeStringExtend(view, this.userName);
        return view;
    }
    getLength() {
        return DataViewUtil.getStringBytes(this.userName);
    }
    recieved(view) {
        this.userName = DataViewUtil.readStringExtend(view);
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const serverClient = ctx.getServerClient();
        // serverClient.userName = this.userName;
        var entityP = serverIn.spawnPlayer(serverClient, this.userName);
        console.log(`player (${entityP.userName}) uuid:${entityP.uuid} was joined`);
    }
}
class PacketToServerPlayerRespawn {
    constructor() { }
    getMessage(view) {
        return view;
    }
    getLength() {
        return 0;
    }
    recieved(view) {
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const serverClient = ctx.getServerClient();
        const player = serverClient.entityPlayer;
        serverIn.spawnPlayer(serverClient, player === null || player === void 0 ? void 0 : player.userName);
    }
}
class PacketToServerPlayerMove {
    constructor(posX, posY, posZ) {
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
    }
    getMessage(view) {
        view.writeFloat64(this.posX);
        view.writeFloat64(this.posY);
        view.writeFloat64(this.posZ);
        return view;
    }
    getLength() {
        return Float64Array.BYTES_PER_ELEMENT * 3;
    }
    recieved(view) {
        this.posX = view.readFloat64();
        this.posY = view.readFloat64();
        this.posZ = view.readFloat64();
    }
    handle(ctx) {
        var _d;
        const serverIn = ctx.getGame();
        const serverClient = ctx.getServerClient();
        var entity = serverClient.entityPlayer;
        if (entity == null)
            throw new PacketException("client entity is invalid");
        const userName = entity instanceof EntityPlayerServer ? (_d = entity.userName) !== null && _d !== void 0 ? _d : "???" : "???";
        if (!isFinite(this.posX) || !isFinite(this.posY) || !isFinite(this.posZ)) {
            // server.kick("invalid movement", client)
            throw new PacketException(`player (${userName}) uuid:${entity.uuid} was invalid movement (x:${this.posX}, y:${this.posY}, z:${this.posZ})`);
            return;
        }
        ;
        let wasInvalidMovement = false; //!entity.isAlive();
        if (serverIn.doCheckSpeed && !wasInvalidMovement && MathUtil.getDistance3(entity.posX(), entity.posY(), entity.posZ(), this.posX, this.posY, this.posZ) > serverIn.playerMoveMaxSpeed) {
            console.log(`player (${userName}) uuid:${entity.uuid} was too fast (x:${this.posX}, y:${this.posY}, z:${this.posZ})`);
            wasInvalidMovement || (wasInvalidMovement = true);
        }
        if (!wasInvalidMovement) {
            const moveDis = vec3.sub(vec3.create(), vec3.fromValues(this.posX, this.posY, this.posZ), entity.pos);
            entity.move(moveDis);
            serverIn.sendWithOut(new PacketToClientEntityMove(entity.uuid, entity.posX(), entity.posY(), entity.posZ()), serverClient);
        }
        // クライアントとサーバーのプレイヤーの位置がずれた時の許容値
        if (serverIn.doCheckClip && !wasInvalidMovement && MathUtil.getDistance3(entity.posX(), entity.posY(), entity.posZ(), this.posX, this.posY, this.posZ) > serverIn.playerMoveDiffTolerance) {
            console.log(`player (${userName}) uuid:${entity.uuid} was invalid movement (x:${this.posX}, y:${this.posY}, z:${this.posZ})`);
            wasInvalidMovement || (wasInvalidMovement = true);
        }
        if (wasInvalidMovement)
            serverIn.send(new PacketToClientEntityMove(entity.uuid, entity.posX(), entity.posY(), entity.posZ()), serverClient);
        if (entity instanceof EntityPlayer)
            entity.triggerOnPlayerMove(serverIn);
    }
}
class PacketToServerPlayerDataSync {
    constructor(propertyId, data) {
        this.propertyId = propertyId;
        this.data = data;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeFloat64(this.data);
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT + Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.data = view.readFloat64();
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const serverClient = ctx.getServerClient();
        var entity = serverClient.entityPlayer;
        if (entity == null)
            throw new PacketException("invalid entity uuid " + serverClient.entityPlayer.uuid + " is not exist");
        const property = entity.syncManager.get(this.propertyId);
        if (property instanceof EntityDataSyncProperty) {
            // if (typeof this.data !== property.typeStr) throw new PacketException("invalid data type", this.data as number);
            property.set(this.data);
        }
        else {
            throw new PacketException("entity sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToServerPlayerEventSync {
    constructor(propertyId, dataArr, dataLength) {
        this.propertyId = propertyId;
        this.dataArr = dataArr;
        this.dataLength = dataLength;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeInt8(this.dataLength);
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.dataArr[i]);
        }
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT * 2 + this.dataLength * Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.dataLength = view.readInt8();
        ;
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
        for (let i = 0; i < this.dataLength; i++) {
            this.dataArr[i] = view.readFloat64();
        }
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const serverClient = ctx.getServerClient();
        var entity = serverClient.entityPlayer;
        if (entity == null)
            throw new PacketException("invalid entity uuid " + serverClient.entityPlayer.uuid + " is not exist");
        const property = entity.syncManager.get(this.propertyId);
        if (property instanceof EntityEventSyncProperty) {
            property.set(this.dataArr);
            property.recivedTrigger(serverIn);
        }
        else {
            throw new PacketException("entity sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToServerLevelDataSync {
    constructor(propertyId, data) {
        this.propertyId = propertyId;
        this.data = data;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeFloat64(this.data);
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT + Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.data = view.readFloat64();
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const property = serverIn.levelSyncManager.get(this.propertyId);
        if (property instanceof LevelDataSyncProperty) {
            // if (typeof this.data !== property.typeStr) throw new PacketException("invalid data type", this.data!);
            property.set(this.data);
        }
        else {
            throw new PacketException("level sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToServerLevelEventSync {
    constructor(propertyId, dataArr, posArr, dataLength) {
        this.propertyId = propertyId;
        this.dataArr = dataArr;
        this.posArr = posArr;
        this.dataLength = dataLength;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeInt8(this.dataLength);
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.dataArr[i]);
        }
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.posArr[i * 3 + 0]);
            view.writeFloat64(this.posArr[i * 3 + 1]);
            view.writeFloat64(this.posArr[i * 3 + 2]);
        }
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT * 2 + this.dataLength * Float64Array.BYTES_PER_ELEMENT * 4;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.dataLength = view.readInt8();
        ;
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
        this.posArr = new Float64Array(MAX_EVENT_DATA_LENGTH * 3);
        for (let i = 0; i < this.dataLength; i++) {
            this.dataArr[i] = view.readFloat64();
        }
        for (let i = 0; i < this.dataLength; i++) {
            this.posArr[i * 3 + 0] = view.readFloat64();
            this.posArr[i * 3 + 1] = view.readFloat64();
            this.posArr[i * 3 + 2] = view.readFloat64();
        }
    }
    handle(ctx) {
        const serverIn = ctx.getGame();
        const property = serverIn.levelSyncManager.get(this.propertyId);
        if (property instanceof LevelEventSyncProperty) {
            if (this.posArr.length / 3 !== this.dataArr.length) {
                throw new PacketException("array length mismatch", this.posArr.length, this.dataArr.length);
            }
            property.set(this.posArr, this.dataArr, this.dataLength);
            property.recivedTrigger(serverIn);
        }
        else {
            throw new PacketException("level sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToClientEntityCreateBase {
    constructor(entity) {
        if (entity == null)
            return;
        this.entityUUID = entity.uuid;
        [this.entityPosX, this.entityPosY, this.entityPosZ] = entity.pos;
        [this.entityVelX, this.entityVelY, this.entityVelZ] = entity.velocity;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeFloat64(this.entityPosX);
        view.writeFloat64(this.entityPosY);
        view.writeFloat64(this.entityPosZ);
        view.writeFloat64(this.entityVelX);
        view.writeFloat64(this.entityVelY);
        view.writeFloat64(this.entityVelZ);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Float64Array.BYTES_PER_ELEMENT * 6;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.entityPosX = view.readFloat64();
        this.entityPosY = view.readFloat64();
        this.entityPosZ = view.readFloat64();
        this.entityVelX = view.readFloat64();
        this.entityVelY = view.readFloat64();
        this.entityVelZ = view.readFloat64();
    }
    initEntity(entity) {
        entity.uuid = this.entityUUID;
        entity.setPos(this.entityPosX, this.entityPosY, this.entityPosZ);
        entity.setVelocity(this.entityVelX, this.entityVelY, this.entityVelZ);
    }
}
class PacketToClientEntityCreate extends PacketToClientEntityCreateBase {
    constructor(entity) {
        super(entity);
        if (entity == null)
            return;
        const entityType = EntityType.getByInstance(entity);
        if (entityType == null) {
            console.log(entity);
            throw Error("invalid entity type which is not registered ");
        }
        this.entityType = entityType;
    }
    getMessage(view) {
        super.getMessage(view);
        view.writeInt8(this.entityType);
        return view;
    }
    getLength() {
        return super.getLength() + Uint8Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        super.recieved(view);
        this.entityType = view.readInt8();
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        if (!EntityType.hasId(this.entityType)) {
            throw new PacketException(`entityType ${this.entityType} is not found`);
        }
        if (clientIn.entities.hasUUID(this.entityUUID)) {
            // clientIn.entities.getByUUID(this.entityUUID)!.recreateByPacket(this.entityUUID!);
        }
        else {
            const entity = new (EntityType.getById(this.entityType))(clientIn);
            this.initEntity(entity);
            entity.spawn(clientIn);
        }
    }
}
class PacketToClientOtherPlayerCreate extends PacketToClientEntityCreateBase {
    handle(ctx) {
        const clientIn = ctx.getGame();
        if (clientIn.entities.hasUUID(this.entityUUID)) {
            // clientIn.entities.getByUUID(this.entityUUID)!.recreateByPacket(this as any);
        }
        else {
            const player = new EntityPlayerOtherClient(clientIn);
            this.initEntity(player);
            player.spawn(clientIn);
        }
    }
}
class PacketToClientLogin extends PacketToClientEntityCreateBase {
    handle(ctx) {
        const clientIn = ctx.getGame();
        const player = new EntityPlayerClient(clientIn).spawn(clientIn);
        this.initEntity(player);
        clientIn.entityPlayer = player;
        clientIn.scene = SceneType.MAIN;
        clientIn.hasLoadFinished = true;
    }
}
class PacketToClientEntityDiscard {
    constructor(entityUUID) {
        this.entityUUID = entityUUID;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity == null)
            return;
        entity.discard(clientIn);
    }
}
class PacketToClientUpdatePlayerData {
    constructor(player) {
        if (player == null)
            return;
        this.entityUUID = player.uuid;
        this.health = player.health.get();
        this.maxHealth = player.getMaxHealth();
        this.name = player.userName;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeInt16(this.health);
        view.writeInt16(this.maxHealth);
        DataViewUtil.writeStringExtend(view, this.name);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Int16Array.BYTES_PER_ELEMENT * 2 + DataViewUtil.getStringBytes(this.name);
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.health = view.readInt16();
        this.maxHealth = view.readInt16();
        this.name = DataViewUtil.readStringExtend(view);
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        const playerData = new PlayerData(this.health, this.maxHealth, this.name);
        clientIn.playersData.set(this.entityUUID, playerData);
        const player = clientIn.entities.getPlayers().getByUUID(this.entityUUID);
        if (player == null)
            return;
        player.playersData = playerData;
    }
}
class PacketToClientDeletePlayerData {
    constructor(entityUUID) {
        this.entityUUID = entityUUID;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        if (clientIn.playersData.has(this.entityUUID))
            clientIn.playersData.delete(this.entityUUID);
    }
}
class PacketToClientEntityMove {
    constructor(entityUUID = crypto.randomUUID(), posX = 0, posY = 0, posZ = 0) {
        this.entityUUID = entityUUID;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.shouldDelayPacket = true;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeFloat64(this.posX);
        view.writeFloat64(this.posY);
        view.writeFloat64(this.posZ);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Float64Array.BYTES_PER_ELEMENT * 3;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.posX = view.readFloat64();
        this.posY = view.readFloat64();
        this.posZ = view.readFloat64();
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity == null)
            return; //throw new PacketException("invalid entity uuid " + this.entityUUID + " is not exist");
        if (!TypeUtil.isFiniteNumber(this.posX) || !TypeUtil.isFiniteNumber(this.posY) || !TypeUtil.isFiniteNumber(this.posZ))
            throw new PacketException("invalid movement", this.posX, this.posY, this.posZ);
        entity.setPos(this.posX, this.posY, this.posZ);
    }
}
class PacketToClientEntityVelocity {
    constructor(entityUUID = crypto.randomUUID(), velocityX = 0, velocityY = 0, velocityZ = 0) {
        this.entityUUID = entityUUID;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.velocityZ = velocityZ;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeFloat64(this.velocityX);
        view.writeFloat64(this.velocityY);
        view.writeFloat64(this.velocityZ);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Float64Array.BYTES_PER_ELEMENT * 3;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.velocityX = view.readFloat64();
        this.velocityY = view.readFloat64();
        this.velocityZ = view.readFloat64();
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity == null)
            return; //throw new PacketException("invalid entity uuid " + this.entityUUID + " is not exist");
        if (!TypeUtil.isFiniteNumber(this.velocityX) || !TypeUtil.isFiniteNumber(this.velocityY) || !TypeUtil.isFiniteNumber(this.velocityZ))
            throw new PacketException("invalid movement", this.velocityX, this.velocityY, this.velocityZ);
        entity.setVelocity(this.velocityX, this.velocityY, this.velocityZ);
    }
}
class PacketToClientHurtAnimation {
    constructor(entityUUID = crypto.randomUUID()) {
        this.entityUUID = entityUUID;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity instanceof EntityLiving)
            entity.HurtAnimationStart();
    }
}
class PacketToClientEntityDataSync {
    constructor(entityUUID, propertyId, data) {
        this.entityUUID = entityUUID;
        this.propertyId = propertyId;
        this.data = data;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeInt8(this.propertyId);
        view.writeFloat64(this.data);
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Int8Array.BYTES_PER_ELEMENT + Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.propertyId = view.readInt8();
        this.data = view.readFloat64();
    }
    handle(ctx) {
        // console.log(this.propertyKey)
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity == null)
            return; //throw new PacketException("invalid entity uuid " + this.entityUUID + " is not exist");
        const property = entity.syncManager.get(this.propertyId);
        if (property instanceof EntityDataSyncProperty) {
            // if (typeof this.data !== property.typeStr) throw new PacketException("invalid data type", this.data);
            property.set(this.data);
        }
        else {
            throw new PacketException("entity sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToClientEntityEventSync {
    constructor(entityUUID, propertyId, dataArr, dataLength) {
        this.entityUUID = entityUUID;
        this.propertyId = propertyId;
        this.dataArr = dataArr;
        this.dataLength = dataLength;
    }
    getMessage(view) {
        DataViewUtil.writeUUIDExtend(view, this.entityUUID);
        view.writeInt8(this.propertyId);
        view.writeInt8(this.dataLength);
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.dataArr[i]);
        }
        return view;
    }
    getLength() {
        return DataViewUtil.UUID_BYTES + Int8Array.BYTES_PER_ELEMENT * 2 + this.dataLength * Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.entityUUID = DataViewUtil.readUUIDExtend(view);
        this.propertyId = view.readInt8();
        this.dataLength = view.readInt8();
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
        for (let i = 0; i < this.dataLength; i++) {
            this.dataArr[i] = view.readFloat64();
        }
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        var entity = clientIn.entities.getByUUID(this.entityUUID);
        if (entity == null)
            return; //throw new PacketException("invalid entity uuid " + this.entityUUID + " is not exist");
        const property = entity.syncManager.get(this.propertyId);
        if (property instanceof EntityEventSyncProperty) {
            property.set(this.dataArr);
            property.recivedTrigger(clientIn);
        }
        else {
            throw new PacketException("entity sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToClientLevelDataSync {
    constructor(propertyId, data) {
        this.propertyId = propertyId;
        this.data = data;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeFloat64(this.data);
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT + Float64Array.BYTES_PER_ELEMENT;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.data = view.readFloat64();
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        const property = clientIn.levelSyncManager.get(this.propertyId);
        if (property instanceof LevelDataSyncProperty) {
            // if (typeof this.data !== property.typeStr) throw new PacketException("invalid data type", this.data!);
            property.set(this.data);
        }
        else {
            throw new PacketException("level sync property " + this.propertyId + " is not found");
        }
    }
}
class PacketToClientLevelEventSync {
    constructor(propertyId, dataArr, posArr, dataLength) {
        this.propertyId = propertyId;
        this.dataArr = dataArr;
        this.posArr = posArr;
        this.dataLength = dataLength;
    }
    getMessage(view) {
        view.writeInt8(this.propertyId);
        view.writeInt8(this.dataLength);
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.dataArr[i]);
        }
        for (let i = 0; i < this.dataLength; i++) {
            view.writeFloat64(this.posArr[i * 3 + 0]);
            view.writeFloat64(this.posArr[i * 3 + 1]);
            view.writeFloat64(this.posArr[i * 3 + 2]);
        }
        return view;
    }
    getLength() {
        return Int8Array.BYTES_PER_ELEMENT * 2 + this.dataLength * Float64Array.BYTES_PER_ELEMENT * 4;
    }
    recieved(view) {
        this.propertyId = view.readInt8();
        this.dataLength = view.readInt8();
        ;
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
        this.posArr = new Float64Array(MAX_EVENT_DATA_LENGTH * 3);
        for (let i = 0; i < this.dataLength; i++) {
            this.dataArr[i] = view.readFloat64();
        }
        for (let i = 0; i < this.dataLength; i++) {
            this.posArr[i * 3 + 0] = view.readFloat64();
            this.posArr[i * 3 + 1] = view.readFloat64();
            this.posArr[i * 3 + 2] = view.readFloat64();
        }
    }
    handle(ctx) {
        const clientIn = ctx.getGame();
        const property = clientIn.levelSyncManager.get(this.propertyId);
        if (property instanceof LevelEventSyncProperty) {
            if (this.posArr.length / 3 !== this.dataArr.length) {
                throw new PacketException("array length mismatch", this.posArr.length, this.dataArr.length);
            }
            property.set(this.posArr, this.dataArr, this.dataLength);
            property.recivedTrigger(clientIn);
        }
        else {
            throw new PacketException("level sync property " + this.propertyId + " is not found");
        }
    }
}
class Game {
    constructor() {
        this.sended = new Set;
        this.levelSyncManager = new DataEventSyncManager;
        this.spawnKillEffectEvent = this.levelSyncManager.register(new LevelEventSyncProperty(Side.SERVER, 0x10, this.spawnDeathParticle));
        this.spawnProjectileHitEffectEvent = this.levelSyncManager.register(new LevelEventSyncProperty(Side.SERVER, 0x11, this.spawnProjectileHitParticle));
        this.entities = new EntitiesList;
        this.gameTicks = 0;
        this.lastRecivedPacket = undefined;
        this.wasCrashed = false;
    }
    tickMain() {
        // console.log(this.entities.length)
        for (const entity of this.entities) {
            entity.tick(this);
            entity.checkMovePacket(this);
        }
        this.levelSyncManager.checkSendMain(this, this);
        this.gameTicks++;
    }
    init() {
        this.entities = new EntitiesList;
    }
    onCrash(e) { }
    crash(e) {
        this.wasCrashed = true;
        if (e instanceof PacketException)
            e.trace(this.lastRecivedPacket);
        else if (e != null)
            console.trace(e);
    }
    onPacketExceptionOrError(e) {
        e.trace(this.lastRecivedPacket);
    }
    sendCreatePacket(serverIn, serverClient) {
    }
    spawnDeathParticle(pos, size) { }
    spawnProjectileHitParticle(pos, size) { }
}
Game.LEFT_CLOSE_CODE = 3000;
Game.EXCEPTION_CLOSE_CODE = 3001;
Game.PACKET_EXCEPTION_CLOSE_CODE = 3002;
Game.ENEMY_SPAWN_LIMIT_PER_PLAYERS = 20;
class OfflineServerClient {
    constructor(clientIn) {
        this.clientIn = clientIn;
        this.userId = "";
        this.close = (code, reason) => this.clientIn.kick(code, reason);
        this.send = (msg) => this.clientIn.onRecievedPacket(msg);
        this.on = () => { };
    }
}
class Server extends Game {
    constructor() {
        super(...arguments);
        this.printPerf = false;
        this.doCheckClip = true;
        this.doCheckSpeed = true;
        this.playerMoveMaxSpeed = 8;
        this.playerMoveDiffTolerance = 0.5;
        this.savehandler = new SaveHandler(this);
        this.kickAll = () => { };
        this.kick = () => { };
        this.sendRaw = () => { };
        this.send = () => { };
        this.sendAll = () => { };
        this.sendAllWithFilter = () => { };
        this.sendWithOut = () => { };
        this.getClients = () => { };
        this.packetHandler = new PacketHandler(this, PacketHandler.ServerRegistry, PacketHandler.ClientRegistry);
        this.hasInited = false;
        this.disposed = false;
    }
    // debug: (msg: any) => any = () => { };
    onLineInit() {
        const server = require('ws').Server;
        const port = 8001;
        const wss = new server({ port: port });
        //const { v4: uuidv4 } = require('uuid');
        console.log("serving at port" + port);
        wss.on('connection', (client) => {
            console.log('connected!');
            client.on('message', (msg) => this.onRecievedPacket(Util.bufferToArrayBuffer(msg), client));
            client.on('close', (code, reason) => {
                this.disconnectMain(client.entityPlayer);
                console.log(`disconnected! code: ${code}, reason: ${reason}`);
            });
            this.playerJoinPreInit(client);
            // setInterval(e => console.log(client.entityPlayer.uuid), 1000)
        });
        this.kickAll = (code = 1000, reason) => wss.clients.forEach((client) => this.kick(client, code, reason));
        this.kick = (client, code = 1000, reason) => client.close(code, reason !== null && reason !== void 0 ? reason : "");
        this.sendRaw = (msg, client) => msg != null && client.send(msg);
        this.send = (packet, client) => this.sendRaw(this.packetHandler.getJsonByPacket(packet).buffer, client);
        this.sendAll = (packet) => wss.clients.forEach((client) => this.send(packet, client));
        this.sendAllWithFilter = (packet, filter) => wss.clients.forEach((client) => filter(client, this) ? this.send(packet, client) : null);
        this.sendWithOut = (packet, ignoreClient) => wss.clients.forEach((client) => client !== ignoreClient ? this.send(packet, client) : false);
        this.getClients = () => wss.clients.forEach((client, index) => console.log(`${index}:${client.userId}`));
        // this.debug = (msg) => wss.clients.forEach((client: { userId: any; }, index: any) => console.log(`${index}:${client.userId}`));
        this.init();
    }
    offLineInit(client) {
        this.kickAll = (code = 1000, reason) => this.kick(client, code, reason);
        this.kick = (client, code = 1000, reason) => client.close(code, reason !== null && reason !== void 0 ? reason : "");
        this.sendRaw = (msg, client) => msg != null && client.send(msg);
        this.send = (packet, client) => this.sendRaw(this.packetHandler.getJsonByPacket(packet).buffer, client);
        this.sendAll = (packet) => this.send(packet, client);
        this.sendAllWithFilter = (packet, filter) => filter(client, this) ? this.send(packet, client) : null;
        this.sendWithOut = (packet, ignoreClient) => { };
        this.playerJoinPreInit(client);
        this.init();
    }
    onRecievedPacket(msg, client) {
        try {
            // let msgRaw = msg.toString();
            // let msgObj = JSON.parse(msgRaw);
            const packet = this.packetHandler.createPacket(new DataViewExtend(msg));
            this.lastRecivedPacket = packet;
            if (Core.debugPacketLog)
                console.log("server recieve", msg, packet);
            this.packetHandler.tryHandle(packet, new PacketSideContext(this, client));
        }
        catch (e) {
            if (e instanceof PacketException)
                this.onPacketExceptionOrError(e, client);
            else
                throw e;
        }
    }
    onPacketExceptionOrError(e, client) {
        super.onPacketExceptionOrError(e);
        this.kick(client, Game.PACKET_EXCEPTION_CLOSE_CODE, e.msg);
    }
    playerJoinPreInit(client) {
        // client.userName = null;
    }
    playerLeave(player) {
        var _d;
        // this.sendAll({ msgType: "entityLeave", entityUUID: entityUUID })
        const result = (_d = player === null || player === void 0 ? void 0 : player.discard) === null || _d === void 0 ? void 0 : _d.call(player, this);
        if (result)
            console.log("removed: ", player.uuid);
        else
            console.error("remove error  uuid: ", player.uuid);
    }
    disconnectMain(player) {
        this.playerLeave(player);
    }
    init() {
        if (!this.hasInited) {
            this.tickInterValId = setInterval(this.tick.bind(this), 1000 / 20);
            this.debugLogInterValId = setInterval(this.debugLog.bind(this), 1000);
        }
        this.hasInited = true;
    }
    dispose() {
        clearInterval(this.tickInterValId);
        clearInterval(this.debugLogInterValId);
        this.disposed = true;
    }
    tick() {
        try {
            serverTickPerf.Start();
            // console.log("server tick")
            this.tickMain();
            this.packetHandler.tick();
            if (this.gameTicks % 100 == 0 && Core.debugEntitySpawn)
                this.tryEnemySpawn();
            this.updatePlayersData(undefined);
            // this.debug()
            // this.entities.forEach(e => console.log(...e.pos))
            serverTickPerf.End();
        }
        catch (e) {
            console.warn("server tick error");
            this.crash(e);
        }
    }
    crash(e) {
        super.crash(e);
        this.onCrash(e);
        this.dispose();
    }
    tryEnemySpawn() {
        for (const player of this.entities.getPlayers()) {
            const pos = MathUtil.random(0, 1);
            const posX = Math.cos(pos * Math.PI) * 10 + player.pos[0];
            const posZ = Math.sin(pos * Math.PI) * 10 + player.pos[2];
            if (!this.canSpawnEnemy())
                continue;
            let tryCount = 0;
            while (tryCount < 10) {
                tryCount++;
                const entity = new EntityType.OCTOPUS(this);
                if (entity.isOnWall())
                    continue;
                entity.setPos(posX, 0, posZ);
                entity.setPowerLevelAndUpdate(MathUtil.getDistance2(0, 0, posX, posZ));
                entity.spawn(this);
                break;
            }
        }
    }
    canSpawnEnemy() {
        return this.entities.getOnlyClass(EntityEnemy).length < this.getEnemySpawnLimit();
    }
    getEnemySpawnLimit() {
        return this.entities.getPlayers().length * Game.ENEMY_SPAWN_LIMIT_PER_PLAYERS;
    }
    spawnPlayer(serverClient, userName) {
        for (const entity of this.entities) {
            entity.sendCreatePacket(this, serverClient);
        }
        const plUuid = crypto.randomUUID();
        // server.send({ msgType: "playerLogin", entityUUID: plUuid }, client);
        var entityP = new EntityPlayerServer(this, serverClient);
        const spawnPos = entityP.getSpawnPoint(this);
        entityP.uuid = plUuid;
        entityP.userName = userName;
        entityP.setPos(spawnPos[0], spawnPos[1], spawnPos[2]);
        serverClient.entityPlayer = entityP;
        this.send(new PacketToClientLogin(entityP), serverClient);
        entityP.spawn(this);
        this.updatePlayersData(serverClient);
        return entityP;
    }
    debugLog() {
        // console.log(...this.entities.map(e => e.uuid));
        // console.log(this.entities.map(e => e.constructor.name + e.pos.toString()))
        if (this.printPerf)
            console.log("tps:" + serverTickPerf.frameParSec);
    }
    updatePlayersData(client) {
        for (const player of this.entities.getPlayers()) {
            if (player.uuid == null)
                continue;
            const msgObj = new PacketToClientUpdatePlayerData(player);
            if (client) {
                this.send(msgObj, client);
            }
            else if (player instanceof EntityPlayerServer && player.shouldUpdateHealth) {
                this.sendAll(msgObj);
                player.shouldUpdateHealth = false;
            }
        }
    }
}
class IntegratedServer extends Server {
    constructor(client) {
        super();
        this.client = client;
    }
    onCrash(e) {
        if (!this.client.wasCrashed)
            this.client.crash(e);
    }
}
class DedicatedServer extends Server {
    onCrash(e) {
        const msg = e instanceof Error ? e.message : e + "";
        this.kickAll(Game.EXCEPTION_CLOSE_CODE, msg);
    }
}
// #region Client
var SceneType;
(function (SceneType) {
    SceneType[SceneType["TITLE"] = 1] = "TITLE";
    SceneType[SceneType["MAIN"] = 2] = "MAIN";
    SceneType[SceneType["CONNECT"] = 3] = "CONNECT";
})(SceneType || (SceneType = {}));
class ClientOptions {
    constructor() {
        this.reduceParticles = false;
    }
}
class Client extends Game {
    constructor() {
        super(...arguments);
        this.particles = new ParticlesList;
        this.lastTickTime = +new Date;
        this.hasLoadFinished = false;
        this.hasInited = false;
        this.playersData = new Map;
        this.enumScreen = {
            TITLE: Symbol(),
            CONNECT: Symbol(),
            MAIN: Symbol()
        };
        this.scene = SceneType.TITLE;
        this.enumSend = {
            CHAT: Symbol()
        };
        this.currentGui = null;
        this.screenSize = vec2.fromValues(0, 0);
        this.options = new ClientOptions;
        this.isOffline = false;
        this.integratedServer = null;
        this.shouldShowDisconnectScreen = false;
        /** call by server */
        this.kick = () => { };
        /** call by client */
        this.sendRaw = () => { };
        /** call by client */
        this.send = () => { };
        /** call by client not recomend call directly if you want disconnect @see Client.openDisconnectScreen */
        this.disconnect = () => { };
        this.packetHandler = new PacketHandler(this, PacketHandler.ClientRegistry, PacketHandler.ServerRegistry);
        this.pointerMove = vec2.fromValues(0, 0);
        this.disposed = false;
        this.partialTicks = 0;
        this.userName = "satoshiinu";
        this.fov = 60;
        this.cam = new Cam(enum_cam_type.MAIN);
        this.camTitle = new Cam(enum_cam_type.TITLE);
        this.keyHandler = new KeyHandler();
        this.pointerHandler = new PointerHandler(this);
    }
    onLineInit(url) {
        this.isOffline = false;
        const ws = new WebSocket(url);
        this.shouldShowDisconnectScreen = true;
        this.scene = SceneType.CONNECT;
        ws.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () { return this.onRecievedPacket.call(this, yield Util.blobToArrayBuffer(msg.data)); });
        // ws.onmessage = msg => console.log(msg)
        ws.onclose = msg => {
            console.log(`closed: code: ${msg.code}\nreason: ${msg.reason}`);
            this.onDisconnect(msg.code, msg.reason);
        };
        ws.onerror = msg => {
            // console.log("error: ", msg);
            //this.openTitleScreen(true, `Connection Error: ${msg.code}\nreason: ${msg.reason}`);
        };
        this.sendRaw = (msg) => msg != null && ws.send(msg);
        this.send = (packet) => this.sendRaw(this.packetHandler.getJsonByPacket(packet).buffer);
        ws.onopen = () => {
            this.playerJoinInit();
        };
        this.disconnect = (code = 1000, reason) => { ws.close(code, reason); this.openDisconnectScreen(code, reason); };
    }
    offLineInit() {
        const server = new IntegratedServer(this); // オフライン用のサーバーを作成
        this.isOffline = true;
        this.integratedServer = server;
        sr = server;
        // debugRegisterFinalization(server, "server");
        this.scene = SceneType.CONNECT;
        const serverClient = new OfflineServerClient(this);
        server.offLineInit(serverClient);
        this.kick = (code, reason) => { var _d; this.openDisconnectScreen(code, reason); (_d = this.integratedServer) === null || _d === void 0 ? void 0 : _d.dispose(); };
        this.sendRaw = (msg) => msg != null && server.onRecievedPacket(msg, serverClient);
        this.send = (packet) => this.sendRaw(this.packetHandler.getJsonByPacket(packet).buffer);
        this.disconnect = (code = 1000, reason) => { var _d; server.disconnectMain(serverClient.entityPlayer); (_d = this.integratedServer) === null || _d === void 0 ? void 0 : _d.dispose(); this.onDisconnect(code, reason); };
        this.playerJoinInit();
    }
    onDisconnect(code = 1000, reason = "") {
        if (this.shouldShowDisconnectScreen) {
            this.openDisconnectScreen(code, reason);
        }
        else {
            this.titleInit();
        }
        this.clearIntegratedServer();
    }
    clearIntegratedServer() {
        this.shouldShowDisconnectScreen = true;
        this.integratedServer = null;
        this.entityPlayer = null;
        sr = null;
        this.kick = () => { };
        this.sendRaw = () => { };
        this.send = () => { };
        this.disconnect = () => { };
    }
    quit() {
        this.shouldShowDisconnectScreen = false;
        this.disconnect();
    }
    playerJoinInit() {
        this.entities = new EntitiesList;
        this.openGui(null);
        this.send(new PacketToServerPlayerJoin(this.userName));
        // this.send({ msgType: "playerJoin", userName: this.userName });
    }
    titleInit() {
        this.init();
        this.scene = SceneType.TITLE;
        this.openGui(new GuiTitle);
    }
    openDisconnectScreen(disconnScrCode, disconnScrMsg = "") {
        // this.isSelfQuitting = true;
        // this.disconnect(Game.LEFT_CLOSE_CODE, "lefted");
        this.init();
        this.scene = SceneType.TITLE;
        this.openGui(new GuiDisonnect(disconnScrCode, disconnScrMsg));
    }
    onRecievedPacket(msg) {
        try {
            // let msgObj = JSON.parse(msg);
            const packet = this.packetHandler.createPacket(new DataViewExtend(msg));
            this.lastRecivedPacket = packet;
            if (Core.debugPacketLog)
                console.log("client recieve", msg, packet);
            this.packetHandler.tryHandle(packet, new PacketSideContext(this));
        }
        catch (e) {
            if (e instanceof PacketException)
                this.onPacketExceptionOrError(e);
            else
                throw e;
            //disconnect?
        }
    }
    onPacketExceptionOrError(e) {
        super.onPacketExceptionOrError(e);
        this.disconnect(Game.PACKET_EXCEPTION_CLOSE_CODE, e.msg);
    }
    render(now) {
        try {
            clientFlamePerf.Start();
            Renderer.updateFrame(this);
            switch (this.scene) {
                case SceneType.MAIN:
                    if (!this.hasLoadFinished)
                        break;
                    Renderer.renderInGame(this);
                    break;
                case SceneType.TITLE:
                    Renderer.renderTitle(this);
                    break;
                case SceneType.CONNECT:
                    Renderer.renderConnect(this);
                    break;
            }
            Renderer.guiRender(this);
            clientFlamePerf.End();
            this.frameID = requestAnimationFrame(this.render.bind(this));
        }
        catch (e) {
            console.warn("client render error");
            this.crash(e);
        }
    }
    tickMain() {
        for (const particle of this.particles) {
            particle.tick(this);
        }
        super.tickMain();
    }
    tick() {
        var _d, _e, _f, _g;
        try {
            clientTickPerf.Start();
            switch (this.scene) {
                case SceneType.MAIN:
                    if (!this.hasLoadFinished)
                        break;
                    this.tickMain();
                    this.packetHandler.tick();
                    this.deathCheck();
                    this.cam.tick((_e = (_d = this.entityPlayer) === null || _d === void 0 ? void 0 : _d.pos) !== null && _e !== void 0 ? _e : vec3.fromValues(0, 0, 0), (_g = (_f = this.entityPlayer) === null || _f === void 0 ? void 0 : _f.rotation.get()) !== null && _g !== void 0 ? _g : 0);
                    if (Core.debugFreeCam)
                        this.debugFreeCam(this.pointerMove, this.cam);
                    break;
                case SceneType.TITLE:
                case SceneType.CONNECT:
                    this.camTitle.tick(undefined, undefined);
                    if (Core.debugFreeCam)
                        this.debugFreeCam(this.pointerMove, this.camTitle);
                    break;
            }
            this.keyHandler.tick();
            while (this.keyHandler.keyTitle.consumeClick()) {
                this.quit();
            }
            while (this.keyHandler.keyFreecam.consumeClick()) {
                Core.debugFreeCam = !Core.debugFreeCam;
            }
            while (this.keyHandler.keyDebugAbout.consumeClick()) {
                Core.debugtext = !Core.debugtext;
            }
            while (this.keyHandler.keyDebugModule.consumeClick()) {
                this.send(new PacketToServerPlayerMove(NaN, NaN, NaN));
            }
            this.pointerMove = vec2.fromValues(0, 0);
            this.lastTickTime = +new Date;
            clientTickPerf.End();
        }
        catch (e) {
            console.warn("client tick error");
            this.crash(e);
        }
    }
    crash(e) {
        super.crash(e);
        this.onCrash(e);
        this.dispose();
    }
    onCrash(e) {
        if (this.integratedServer && !this.integratedServer.wasCrashed)
            this.integratedServer.crash(e);
    }
    init() {
        super.init();
        if (!this.hasInited) {
            this.frameID = requestAnimationFrame(this.render.bind(this));
            this.intervalID = setInterval(this.tick.bind(this), 1000 / 20);
            const canvasClick = document.getElementById("canvasRender");
            if (canvasClick == null || canvasClick instanceof HTMLCanvasElement == false)
                throw Error("canvas not found");
            const canvasRender = document.getElementById("canvasRender");
            if (canvasRender == null || canvasRender instanceof HTMLCanvasElement == false)
                throw Error("canvas not found");
            this.gl = Renderer.canvasInit(canvasRender);
            this.canvasClick = canvasClick;
            this.pointerHandler.init(this.canvasClick);
            this.updateScreenSize(canvasClick);
            this.guiEventInit(canvasClick);
        }
        this.playersData = new Map;
        this.entities = new EntitiesList;
        this.guiHud = new GuiHud;
        this.guiHud.initGui(this);
        this.guiDebug = new GuiDebug;
        this.guiDebug.initGui(this);
        this.hasInited = true;
    }
    deathCheck() {
        if (this.entityPlayer != null && !this.entityPlayer.isAlive())
            this.openGui(new GuiDeath);
    }
    updateScreenSize(canvas) {
        this.screenSize = vec2.fromValues(canvas.width, canvas.height);
    }
    guiEventInit(canvas) {
        function getScale(elem, rect) {
            const scaleX = elem.width / rect.width;
            const scaleY = elem.height / rect.height;
            return vec2.fromValues(scaleX, scaleY);
        }
        function getScaledPos(elem, rect, mouseX, mouseY) {
            const scale = getScale(elem, rect);
            const scaledX = mouseX * scale[0];
            const scaledY = mouseY * scale[1];
            return vec2.fromValues(scaledX, scaledY);
        }
        function getScaledCanvasSize(elem, rect) {
            const scale = getScale(elem, rect);
            const scaledWidth = rect.width * scale[0];
            const scaledHeight = rect.height * scale[1];
            return vec2.fromValues(scaledWidth, scaledHeight);
        }
        const client = this;
        const touchData = new Map;
        let contextMenuTriggered = false;
        // down or start
        document.addEventListener('mousedown', e => {
            onPressed(e.clientX, e.clientY, e);
        });
        document.addEventListener('touchstart', e => {
            contextMenuTriggered = false;
            let clicked = false;
            for (const touch of e.touches) {
                touchData.set(touch.identifier, vec2.fromValues(touch.clientX, touch.clientY));
                onPressed(touch.clientX, touch.clientY, e);
                clicked || (clicked = isInCanvas(touch.clientX, touch.clientY));
            }
            if (clicked)
                e.preventDefault();
        }, { passive: false });
        // move
        document.addEventListener('mousemove', e => {
            onMove(e.movementX, e.movementY, e);
        });
        document.addEventListener('touchmove', e => {
            let touched = false;
            for (const touch of e.touches) {
                const touchStart = touchData.get(touch.identifier);
                const touchMovement = vec2.fromValues(touch.clientX - touchStart[0], touch.clientY - touchStart[1]);
                touchData.set(touch.identifier, vec2.fromValues(touch.clientX, touch.clientY));
                onMove(touchMovement[0], touchMovement[1], e);
                touched || (touched = isInCanvas(touchMovement[0], touchMovement[1]));
            }
            if (touched)
                e.preventDefault();
        }, { passive: false });
        // up or end
        document.addEventListener('mouseup', e => {
            onReleased(e.clientX, e.clientY, e);
        });
        document.addEventListener('touchend', e => {
            for (const touch of e.changedTouches) {
                touchData.delete(touch.identifier);
            }
            setTimeout(() => {
                if (contextMenuTriggered)
                    return contextMenuTriggered = false;
                for (const touch of e.changedTouches) {
                    onReleased(touch.clientX, touch.clientY, e);
                }
            }, 100); // prevent color picker with delete
        }, { passive: false });
        // prevent context meny
        document.addEventListener('contextmenu', e => {
            contextMenuTriggered = true;
            if (isInCanvas(e.clientX, e.clientY) && false)
                e.preventDefault();
        });
        document.addEventListener('sizeChanged', e => {
            client.updateScreenSize(canvas);
        });
        function isInCanvas(clientX, clientY) {
            const domRect = canvas.getBoundingClientRect();
            return domRect.left <= clientX && clientX <= domRect.right && domRect.top <= clientY && clientY <= domRect.bottom;
        }
        function onPressed(clientX, clientY, e) {
            const domRect = canvas.getBoundingClientRect();
            const scaledMouse = getScaledPos(canvas, domRect, clientX - domRect.left, clientY - domRect.top);
            if (client.currentGui != null)
                client.currentGui.onMousePressed(scaledMouse, e);
        }
        function onReleased(movementX, movementY, e) {
            const domRect = canvas.getBoundingClientRect();
            const scaledMouse = getScaledPos(canvas, domRect, movementX, movementY);
            if (client.currentGui != null)
                client.currentGui.onMouseReleased(scaledMouse, e);
        }
        function onMove(clientX, clientY, e) {
            const domRect = canvas.getBoundingClientRect();
            const scaledMouse = getScaledPos(canvas, domRect, clientX - domRect.left, clientY - domRect.top);
            if (client.currentGui != null)
                client.currentGui.onMouseMoved(scaledMouse, e);
        }
    }
    handleLogin(msgObj) {
        this.tempPlayerUuid = msgObj.entityUUID;
        // this.entityPlayer = this.entities.getByUUID(msgObj.entityUUID)
        this.playersData = new Map;
        // console.log("client side login: ", msgObj.entityUUID);
    }
    dispose() {
        clearInterval(this.intervalID);
        if (this.frameID != null)
            cancelAnimationFrame(this.frameID);
        this.disposed = true;
    }
    updatePartialTick() {
        return this.partialTicks = MathUtil.clamp(0, (+new Date - this.lastTickTime) / 50, 1);
    }
    setUserName(name) {
        this.userName = name;
    }
    getGuiScale() {
        return 6;
    }
    debugFreeCam(camMove, cam) {
        const speed = 1;
        if (this.keyHandler.keyLeft.isDown)
            cam.move(speed, 0, 0);
        if (this.keyHandler.keyRight.isDown)
            cam.move(-speed, 0, 0);
        if (this.keyHandler.keyRise.isDown)
            cam.move(0, speed, 0);
        if (this.keyHandler.keyDescent.isDown)
            cam.move(0, -speed, 0);
        if (this.keyHandler.keyUp.isDown)
            cam.move(0, 0, speed);
        if (this.keyHandler.keyDown.isDown)
            cam.move(0, 0, -speed);
        cam.rotate(camMove[0], camMove[1]);
    }
    openGui(gui) {
        if (gui != null)
            gui.initGui(this);
        this.currentGui = gui;
    }
    getDefaultScreen() {
        switch (this.scene) {
            case SceneType.TITLE:
                return new GuiTitle();
            case SceneType.MAIN:
                return new GuiHud();
            case SceneType.CONNECT:
                return new GuiTitle();
        }
    }
    spawnDeathParticle(pos, size) {
        for (let index = 0; index < 8; index++) {
            const particle = MathUtil.randomInt(0, 2) == 0 ? new ParticleDeathSmokeSmall(pos, size) : new ParticleDeathSmoke(pos, size);
            particle.spawn(this);
        }
    }
    spawnProjectileHitParticle(pos, size) {
        for (let index = 0; index < 4; index++) {
            const particle = new ParticleProjectileHit(vec3.add(vec3.create(), pos, vec3.random(vec3.create(), 0.5)), size);
            particle.spawn(this);
        }
    }
}
// #region Game Logic
class KeyHandler {
    constructor() {
        this.set = new Set;
        this.keyUp = this.register(new KeyMapping("KeyW"));
        this.keyLeft = this.register(new KeyMapping("KeyA"));
        this.keyDown = this.register(new KeyMapping("KeyS"));
        this.keyRight = this.register(new KeyMapping("KeyD"));
        this.keyDescent = this.register(new KeyMapping("ShiftLeft"));
        this.keyRise = this.register(new KeyMapping("Space"));
        this.keyAttack = this.register(new KeyMapping("Space"));
        this.keyTitle = this.register(new KeyMapping("KeyP"));
        this.keyFreecam = this.register(new KeyMapping("KeyF"));
        this.keyDebugAbout = this.register(new KeyMapping("KeyC"));
        this.keyDebugModule = this.register(new KeyMapping("KeyZ"));
    }
    tick() {
        this.set.forEach(e => e.tick());
    }
    register(keyMapping) {
        this.set.add(keyMapping);
        return keyMapping;
    }
}
class KeyMapping {
    constructor(keyCode) {
        this.isPressStarted = false;
        this.isDown = false;
        this.pressTick = 0;
        this.clickCount = 0;
        addEventListener("keydown", e => { if (e.code == keyCode)
            this.setDown(); });
        addEventListener("keyup", e => { if (e.code == keyCode)
            this.setUp(); });
    }
    setDown() {
        if (!this.isDown)
            this.pressTick = 0;
        this.isDown = true;
        this.clickCount++;
    }
    setUp() {
        this.isDown = false;
    }
    tick() {
        this.isPressStarted = this.pressTick == 0;
        this.pressTick++;
    }
    consumeClick() {
        if (!isFinite(+this.clickCount))
            throw Error("FATAL ERROR: clickCount is not finite");
        if (this.clickCount == 0) {
            return false;
        }
        else {
            this.clickCount--;
            return true;
        }
    }
}
class PointerHandler {
    constructor(clientIn) {
        this.clientIn = clientIn;
    }
    init(canvas) {
        if (canvas == null)
            throw Error("canvas not found");
        if ("onpointerlockchange" in document) {
            document.addEventListener("pointerlockchange", lockChangeAlert.bind(this), false);
        }
        const moveFunc = this.move.bind(this);
        function lockChangeAlert() {
            if (this.isLocked(canvas)) {
                //console.log("The pointer lock status is now locked");
                document.addEventListener("mousemove", moveFunc, false);
            }
            else {
                //console.log("The pointer lock status is now unlocked");
                document.removeEventListener("mousemove", moveFunc, false);
            }
        }
        canvas.addEventListener("click", this.lock);
    }
    isLocked(canvas) {
        return (document.pointerLockElement === canvas);
    }
    lock(event) {
        if (!Core.debugFreeCam)
            return;
        const canvas = event.srcElement;
        canvas.requestPointerLock =
            canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
    }
    move(e) {
        this.clientIn.pointerMove[0] += e.movementX;
        this.clientIn.pointerMove[1] += e.movementY;
    }
}
const enum_cam_type = {
    MAIN: Symbol(),
    TITLE: Symbol(),
};
class Cam {
    constructor(type) {
        this.dir = vec3.fromValues(0, 0, 0); // pitch yaw roll
        this.oldDir = vec3.fromValues(0, 0, 0);
        this.pos = vec3.fromValues(0, 0, 0);
        this.oldPos = vec3.fromValues(0, 0, 0);
        this.playerYaw = 0;
        this.type = enum_cam_type.MAIN;
        this.type = type;
    }
    tick(pos, rotate) {
        this.oldDir[0] = this.dir[0];
        this.oldDir[1] = this.dir[1];
        this.oldDir[2] = this.dir[2];
        this.oldPos[0] = this.pos[0];
        this.oldPos[1] = this.pos[1];
        this.oldPos[2] = this.pos[2];
        if (Core.debugFreeCam)
            return;
        switch (this.type) {
            case enum_cam_type.MAIN:
                if (pos == null)
                    return;
                if (rotate == null)
                    return;
                this.pos[0] = pos[0];
                this.pos[1] = pos[1] + 10;
                this.pos[2] = pos[2];
                this.dir[0] = -89.9;
                this.dir[1] = this.playerYaw;
                break;
            case enum_cam_type.TITLE:
                this.pos[0] = 0.0;
                this.pos[1] = 25.0;
                this.pos[2] = 0.0;
                this.dir[0] = -75.0;
                this.dir[1] = (Date.now() / 100) % 360;
                this.dir[2] = 0.0;
                break;
        }
    }
    moveYawByPlayerVel(x, y, z, offset = 0) {
        const degree = MathUtil.calcAngleDegrees(z, x) + offset;
        if (degree < 0 && this.playerYaw > 90)
            this.playerYaw -= 360;
        if (degree > 90 && this.playerYaw < 0)
            this.playerYaw += 360;
        this.playerYaw += (degree - this.playerYaw) * 0.025;
    }
    getRenderPos(partialTicks) {
        const x = MathUtil.lerp(partialTicks, this.oldPos[0], this.pos[0]);
        const y = MathUtil.lerp(partialTicks, this.oldPos[1], this.pos[1]);
        const z = MathUtil.lerp(partialTicks, this.oldPos[2], this.pos[2]);
        return vec3.fromValues(x, y, z);
    }
    getRenderDir(partialTicks) {
        const x = MathUtil.rotLerp(partialTicks, this.oldDir[0], this.dir[0]);
        const y = MathUtil.rotLerp(partialTicks, this.oldDir[1], this.dir[1]);
        const z = MathUtil.rotLerp(partialTicks, this.oldDir[2], this.dir[2]);
        return vec3.fromValues(x, y, z);
    }
    move(x, y, z) {
        var radiansX = MathUtil.toRadian(this.dir[1] + 90);
        var radiansZ = MathUtil.toRadian(this.dir[1]);
        this.pos[0] += Math.sin(radiansZ) * z + Math.sin(radiansX) * x;
        this.pos[1] += y;
        this.pos[2] += Math.cos(radiansZ) * z + Math.cos(radiansX) * x;
    }
    rotate(scrX, scrY) {
        this.dir[0] -= scrY;
        this.dir[1] -= scrX;
        this.dir[2] = 0;
        this.dir[0] = MathUtil.clamp(-89, this.dir[0], 89);
    }
}
Cam.enumTypeMain = Symbol();
Cam.enumTypeTitle = Symbol();
class PathfindNode {
    constructor(x, y) {
        this.x = x; // ノードの x 座標
        this.y = y; // ノードの y 座標
        this.g = Infinity; // スタートノードからのコスト
        this.h = 0; // ゴールノードまでの推定コスト
        this.f = Infinity; // 総コスト (g + h)
        this.parent = null; // 親ノード
    }
}
function heuristic(a, b) {
    // マンハッタン距離を使用
    return Math.abs(a.x - b.y) + Math.abs(a.y - b.y);
}
function getNeighbors(node, getWeight) {
    const neighbors = [];
    const directions = [
        { x: 0, y: 1 }, // 下
        { x: 1, y: 0 }, // 右
        { x: 0, y: -1 }, // 上
        { x: -1, y: 0 }, // 左
    ];
    for (const dir of directions) {
        const newX = node.x + dir.x;
        const newY = node.y + dir.y;
        // getWeight関数を使ってノードの重みを取得
        const weight = getWeight(newX, newY);
        if (weight !== Infinity) {
            neighbors.push(new PathfindNode(newX, newY));
        }
    }
    return neighbors;
}
function astar(start, goal, getWeight) {
    const openList = [];
    const closedList = [];
    start.g = 0;
    start.f = start.h = heuristic(start, goal);
    openList.push(start);
    let count = 0;
    while (openList.length > 0) {
        // 最小の f 値を持つノードを取得
        let lowestIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        const currentNode = openList[lowestIndex];
        // ゴールに到達した場合
        if (currentNode.x === goal.x && currentNode.y === goal.y) {
            const path = [];
            let temp = currentNode;
            while (temp != null) {
                path.push(temp);
                temp = temp.parent;
            }
            return path.reverse(); // パスを逆順にして返す
        }
        // 現在のノードをオープンリストから削除
        openList.splice(lowestIndex, 1);
        closedList.push(currentNode);
        // 隣接ノードを取得
        const neighbors = getNeighbors(currentNode, getWeight);
        for (const neighbor of neighbors) {
            if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue; // クローズリストに含まれている場合
            }
            // g 値を計算 (getWeight関数を使用)
            const weight = getWeight(neighbor.x, neighbor.y);
            const tentativeG = currentNode.g + weight;
            if (tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, goal);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentNode;
                // オープンリストに含まれているか確認
                if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                    openList.push(neighbor);
                }
            }
        }
        count++;
        if (count > 1024)
            return [];
    }
    return []; // パスが見つからなかった場合は空配列を返す
}
function filterByEntityDistance(client, gameIn) {
    const uuid = client.entityPlayer.uuid;
    const player = gameIn.entities.getByUUID(uuid);
    if (player == null)
        return false;
    const entity = this;
    const dis = MathUtil.getDistance3(player.pos[0], player.pos[1], player.pos[2], entity.pos[0], entity.pos[1], entity.pos[2]);
    return dis < 25;
}
function filterByUuid(client, gameIn) {
    return client.entityPlayer.uuid == this;
}
function filterByUuids(client, gameIn) {
    return this.includes(client.entityPlayer.uuid);
}
function isin(player, entity) {
    const dis = MathUtil.getDistance3(player.pos[0], player.pos[1], player.pos[2], entity.pos[0], entity.pos[1], entity.pos[2]);
    return dis < 25;
}
class wasCollisionContext {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
var EntityEventTypes;
(function (EntityEventTypes) {
    EntityEventTypes[EntityEventTypes["PLAYER_SPRINT"] = 1] = "PLAYER_SPRINT";
    EntityEventTypes[EntityEventTypes["OCTOPUS_SHOOT"] = 2] = "OCTOPUS_SHOOT";
})(EntityEventTypes || (EntityEventTypes = {}));
class DataSyncProperty {
    constructor(side, id, value, parentEntity) {
        this.side = side;
        this.id = id;
        this.value = value;
        this.parentEntity = parentEntity;
        this.isDirty = false;
    }
    set(value) {
        if (this.value === value)
            return;
        this.value = value;
        this.isDirty = true;
    }
    get() {
        return this.value;
    }
    trySend(gameIn, force, serverClient) {
        this.isDirty = false;
    }
}
class EntityDataSyncProperty extends DataSyncProperty {
    // updateCondition is check for send data on decided side
    constructor(side, id, value, parentEntity, updateCondition) {
        super(side, id, value, parentEntity);
        this.side = side;
        this.id = id;
        this.value = value;
        this.parentEntity = parentEntity;
        this.updateCondition = updateCondition;
    }
    trySend(gameIn, force = false, serverClient) {
        if ((force || this.isDirty) && (this.updateCondition == null || this.updateCondition(serverClient.entityPlayer, this.value))) {
            if (gameIn instanceof Server) {
                if (serverClient == null)
                    throw Error("bug detected serverClient is null");
                gameIn.send(new PacketToClientEntityDataSync(this.parentEntity.uuid, this.id, this.value), serverClient);
            }
            else if (gameIn instanceof Client) {
                gameIn.send(new PacketToServerPlayerDataSync(this.id, this.value));
            }
            super.trySend(gameIn, force, serverClient);
        }
    }
    entityEquals(entity) {
        return this.parentEntity.equals(entity);
    }
}
class LevelDataSyncProperty extends DataSyncProperty {
    // updateCondition is check for send data on decided side
    constructor(side, id, value, parentEntity, updateCondition) {
        super(side, id, value, parentEntity);
        this.side = side;
        this.id = id;
        this.value = value;
        this.parentEntity = parentEntity;
        this.updateCondition = updateCondition;
    }
    trySend(gameIn, force = false, serverClient) {
        if ((force || this.isDirty) && (this.updateCondition == null || this.updateCondition(this.value))) {
            if (gameIn instanceof Server) {
                if (serverClient == null)
                    throw Error("bug detected serverClient is null");
                gameIn.send(new PacketToClientLevelDataSync(this.id, this.value), serverClient);
            }
            else if (gameIn instanceof Client) {
                gameIn.send(new PacketToServerLevelDataSync(this.id, this.value));
            }
            super.trySend(gameIn, force, serverClient);
        }
    }
}
class EventSyncProperty {
    constructor(side, id) {
        this.side = side;
        this.id = id;
        this.isDirty = false;
        this.count = 0;
    }
    triggered() {
        this.count++;
        this.isDirty = true;
    }
    trySend(gameIn, force, serverClient) {
        this.count = 0;
        this.isDirty = true;
    }
}
const MAX_EVENT_DATA_LENGTH = 256;
class EntityEventSyncProperty extends EventSyncProperty {
    constructor(side, id, predecate, parentEntity) {
        super(side, id);
        this.predecate = predecate;
        this.parentEntity = parentEntity;
        this.dataLength = 0;
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
    }
    set(dataArr) {
        // if (this.dataArr === dataArr) return;
        this.dataArr = dataArr;
        this.isDirty = true;
    }
    recivedTrigger(gameIn) {
        this.dataArr.forEach(e => this.predecate.call(gameIn, e));
    }
    trigger(data) {
        this.dataArr[this.dataLength] = data;
        this.dataLength++;
        super.triggered();
    }
    trySend(gameIn, force = false, serverClient) {
        if (this.dataLength == 0)
            return;
        if (force || this.isDirty) {
            if (gameIn instanceof Server) {
                if (serverClient == null)
                    throw Error("bug detected serverClient is null");
                gameIn.send(new PacketToClientEntityEventSync(this.parentEntity.uuid, this.id, this.dataArr, this.dataLength), serverClient);
            }
            else if (gameIn instanceof Client) {
                gameIn.send(new PacketToServerPlayerEventSync(this.id, this.dataArr, this.dataLength));
            }
            super.trySend(gameIn, force, serverClient);
            this.dataLength = 0;
        }
    }
    entityEquals(entity) {
        return this.parentEntity.equals(entity);
    }
}
class LevelEventSyncProperty extends EventSyncProperty {
    constructor(side, key, predecate) {
        super(side, key);
        this.predecate = predecate;
        this.dataLength = 0;
        this.posArr = new Float64Array(MAX_EVENT_DATA_LENGTH * 3);
        this.dataArr = new Float64Array(MAX_EVENT_DATA_LENGTH);
    }
    set(posArr, dataArr, dataLength) {
        // if (this.posArr === posArr) return;
        // if (this.dataArr === dataArr) return;
        this.posArr = posArr;
        this.dataArr = dataArr;
        this.dataLength = dataLength;
        this.isDirty = true;
    }
    recivedTrigger(gameIn) {
        for (let i = 0; i < this.dataLength; i++) {
            this.predecate.call(gameIn, this.getVec3ByIndex(i), this.dataArr[i]);
        }
    }
    getVec3ByIndex(index) {
        return vec3.fromValues(this.posArr[index * 3 + 0], this.posArr[index * 3 + 1], this.posArr[index * 3 + 2]);
    }
    trigger(pos, data) {
        this.posArr[this.dataLength * 3 + 0] = pos[0];
        this.posArr[this.dataLength * 3 + 1] = pos[1];
        this.posArr[this.dataLength * 3 + 2] = pos[2];
        this.dataArr[this.dataLength] = data;
        this.dataLength++;
        super.triggered();
    }
    trySend(gameIn, force = false, serverClient) {
        if (this.dataLength == 0)
            return;
        if (force || this.isDirty) {
            if (gameIn instanceof Server) {
                if (serverClient == null)
                    throw Error("bug detected serverClient is null");
                gameIn.send(new PacketToClientLevelEventSync(this.id, this.dataArr, this.posArr, this.dataLength), serverClient);
            }
            else if (gameIn instanceof Client) {
                gameIn.send(new PacketToServerLevelEventSync(this.id, this.dataArr, this.posArr, this.dataLength));
            }
            super.trySend(gameIn, force, serverClient);
            this.dataLength = 0;
        }
    }
}
class DataEventSyncManager {
    constructor() {
        this.data = new Map;
    }
    // constructor(public parentEntity: Entity) { }
    register(property) {
        this.data.set(property.id, property);
        return property;
    }
    trySendAllToClient(serverIn, force = false, serverClient) {
        for (const property of this.data.values()) {
            const isClientBroadCast = property.side == Side.CLIENT && (property instanceof EntityEventSyncProperty || property instanceof EntityDataSyncProperty) && !property.entityEquals(serverClient.entityPlayer);
            if (property.side == Side.SERVER || isClientBroadCast) {
                property.trySend(serverIn, force, serverClient);
            }
        }
    }
    trySendAllToServer(clientIn, force = false) {
        for (const property of this.data.values()) {
            const isEntityPlayer = property.side == Side.CLIENT && (property instanceof EntityEventSyncProperty || property instanceof EntityDataSyncProperty) && property.entityEquals(clientIn.entityPlayer);
            if (property.side == Side.CLIENT && ((property instanceof LevelEventSyncProperty || property instanceof LevelDataSyncProperty) || isEntityPlayer)) {
                property.trySend(clientIn, force, undefined);
            }
        }
    }
    checkSendMain(gameIn, syncable) {
        if (gameIn instanceof Server) {
            for (const player of gameIn.entities.getPlayers()) {
                if (player.serverClient == null)
                    throw Error("bug detected serverClient is null");
                if (!syncable.sended.has(player.uuid)) {
                    syncable.sendCreatePacket(gameIn, player.serverClient);
                    this.trySendAllToClient(gameIn, true, player.serverClient);
                    syncable.sended.add(player.uuid);
                }
                // if (syncable instanceof Server) console.log(syncable)
                this.trySendAllToClient(gameIn, false, player.serverClient);
            }
        }
        else if (gameIn instanceof Client) {
            this.trySendAllToServer(gameIn, false);
        }
    }
    get(key) {
        return this.data.get(key);
    }
}
//#region Entity
class Entity {
    constructor(gameIn) {
        var _d;
        this.size = vec2.fromValues(1, 2);
        this.speed = 0.1;
        this.bb = new AABB(0, 0, 0, 0, 0, 0).initBySize(this.size);
        this.pos = vec3.fromValues(0, 0, 0);
        this.oldPos = vec3.fromValues(NaN, NaN, NaN);
        this.velocity = vec3.fromValues(0, 0, 0);
        this.oldMovedDis = 0;
        this.movedDis = 0;
        this.totalMovedDis = 0;
        this.syncVelocity = false;
        this.oldRotation = 0;
        this.ticksAlived = 0;
        this.wasSpawned = false;
        this.wasCollision = new wasCollisionContext(false, false, false);
        this.sended = new Set;
        this.screenPos = vec2.fromValues(NaN, NaN);
        (_d = this.uuid) !== null && _d !== void 0 ? _d : (this.uuid = crypto.randomUUID());
        if (gameIn instanceof Server) {
            this.serverIn = gameIn;
        }
        else if (gameIn instanceof Client) {
            this.clientIn = gameIn;
        }
        this.syncManager = new DataEventSyncManager();
        this.rotation = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, Entity.ROTATION_ID, 0, this));
        // debugRegisterFinalization(this, this.constructor.name);
    }
    tick(gameIn) {
        this.oldMovedDis = this.movedDis;
        this.movedDis = MathUtil.getLength3(this.oldPos[0] - this.pos[0], this.oldPos[1] - this.pos[1], this.oldPos[2] - this.pos[2]);
        if (!isFinite(this.movedDis))
            this.movedDis = this.oldMovedDis;
        this.totalMovedDis += this.movedDis;
        this.oldPos[0] = this.pos[0];
        this.oldPos[1] = this.pos[1];
        this.oldPos[2] = this.pos[2];
        this.oldRotation = this.rotation.get();
        this.syncManager.checkSendMain(gameIn, this);
        if (this.canMove() && this.isAlive())
            this.travel(gameIn);
        this.gravityTick();
        this.frictionTick();
        if (this.canMove())
            this.move(this.velocity);
        if (gameIn instanceof Server)
            this.checkDespawn(gameIn);
        // console.log(this.constructor.name, Math.abs(this.rotation - this.oldRotation), this.rotation, this.oldRotation)
        this.ticksAlived++;
    }
    canHurt() {
        return false;
    }
    isAlive() {
        return true;
    }
    canMove() {
        return true;
    }
    travel(gameIn) {
    }
    checkMovePacket(gameIn) {
        if (vec3.dist(this.pos, this.oldPos) > 0.1)
            this.sendMovePacket(gameIn);
        // if (Math.abs(this.rotation.get() - this.oldRotation) > 1)
        // this.sendRotatePacket(gameIn);
    }
    getCollides() {
        return LevelUtil.getCubes(vec2.fromValues(this.pos[0], this.pos[2]), 2, true);
    }
    saveAsPlayer() {
        return false;
    }
    save(data) {
        if (!this.wasSpawned)
            return;
        const registryName = EntityType.getByInstance(this);
        if (registryName != null)
            data.registryName = registryName;
        data.uuid = this.uuid;
        data.posX = this.pos[0];
        data.posY = this.pos[1];
        data.posZ = this.pos[2];
        data.velX = this.velocity[0];
        data.velY = this.velocity[1];
        data.velZ = this.velocity[2];
        data.rotation = this.rotation.get();
    }
    static getEntityByData(data) {
        if (TypeUtil.isNumber(data.registryName)) {
            const entity = EntityType.getById(data.registryName);
            if (entity != null)
                return entity;
            return null;
        }
        return null;
    }
    load(data, version) {
    }
    spawn(gameIn) {
        if (gameIn.entities.includes(this))
            console.warn("entity ", this, " was double spawned");
        gameIn.entities.push(this);
        if (gameIn instanceof Server) {
            this.syncManager.checkSendMain(gameIn, this);
        }
        this.wasSpawned = true;
        return this;
    }
    sendCreatePacket(serverIn, client, msgObj = {}) {
        if (client && this.equals(client.entityPlayer))
            return;
        const packet = this instanceof EntityPlayer ? new PacketToClientOtherPlayerCreate(this) : new PacketToClientEntityCreate(this);
        if (client == null)
            serverIn.sendAll(packet);
        else
            serverIn.send(packet, client);
    }
    recreateByPacket(entityUUID) {
        // this.setPos(posX ?? 0, posY ?? 0, posZ ?? 0);
        // this.rotation.set(rotation ?? 0);
        this.uuid = entityUUID; //?? crypto.randomUUID();
        return this;
    }
    discard(gameIn) {
        // console.trace(this)
        gameIn.entities.removeByInstance(this);
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        if (gameIn instanceof Server)
            gameIn.sendAll(new PacketToClientEntityDiscard(this.uuid));
        return true;
    }
    checkSend(gameIn) {
        if (gameIn instanceof Server) {
            for (const player of gameIn.entities.getPlayers()) {
                if (player.serverClient == null)
                    throw Error("bug detected serverClient is null");
                if (!this.sended.has(player.uuid)) {
                    this.sendCreatePacket(gameIn, player.serverClient);
                    this.syncManager.trySendAllToClient(gameIn, true, player.serverClient);
                    this.sended.add(player.uuid);
                }
                this.syncManager.trySendAllToClient(gameIn, false, player.serverClient);
            }
        }
        else if (gameIn instanceof Client) {
            this.syncManager.trySendAllToServer(gameIn, false);
        }
    }
    sendMovePacket(gameIn) {
        if (gameIn instanceof Server) {
            gameIn.sendAllWithFilter(new PacketToClientEntityMove(this.uuid, this.pos[0], this.pos[1], this.pos[2]), filterByUuids.bind(Array.from(this.sended.values())));
        }
    }
    sendRotatePacket(gameIn) {
        if (gameIn instanceof Server) {
            // gameIn.sendAllWithFilter({ msgType: "entityRotate", rotation: this.rotation.get(), entityUUID: this.uuid }, filterByUuids.bind(Array.from(this.sended.values())));
        }
    }
    sendEventPacket(gameIn, id, data) {
        if (gameIn instanceof Server) {
            // gameIn.sendAllWithFilter({ msgType: "entityEvent", entityUUID: this.uuid, id: id, data: data }, filterByUuids.bind(Array.from(this.sended.values())));
        }
    }
    recieveEventPacket(gameIn, id, data) {
    }
    addVelocity(x, y, z) {
        this.velocity[0] += x;
        this.velocity[1] += y;
        this.velocity[2] += z;
    }
    setVelocity(x, y, z) {
        this.velocity[0] = x;
        this.velocity[1] = y;
        this.velocity[2] = z;
    }
    frictionTick() {
        const friction = this.getFriction();
        this.velocity[0] *= friction;
        this.velocity[1] *= this.getAirResistance();
        this.velocity[2] *= friction;
    }
    gravityTick() {
        this.velocity[1] -= this.getGravity();
    }
    getGravity() {
        return 0.0;
    }
    getFriction() {
        return this.wasCollision.y ? 0.6 : 0.9;
    }
    getAirResistance() {
        return 0.6;
    }
    getBounce() {
        return vec3.fromValues(0, 0, 0);
    }
    getDistanceByEntity(other) {
        return MathUtil.getDistance3(this.pos[0], this.pos[1], this.pos[2], other.pos[0], other.pos[1], other.pos[2]);
    }
    getHorizontalDistanceByEntity(other) {
        return MathUtil.getDistance2(this.pos[0], this.pos[2], other.pos[0], other.pos[2]);
    }
    onPlayerMove(player, gameIn) {
    }
    move(dis) {
        let [xa, ya, za] = dis;
        if (this.bb == null) {
            vec3.add(this.pos, this.pos, dis);
            this.wasCollision = new wasCollisionContext(false, false, false);
            return;
        }
        if (Math.abs(xa) < 0)
            xa = 0;
        if (Math.abs(ya) < 0)
            ya = 0;
        if (Math.abs(za) < 0)
            za = 0;
        let ogXa = xa;
        let ogYa = ya;
        let ogZa = za;
        let aabbs = this.getCollides();
        for (let aabb of aabbs) {
            xa = aabb.clipXCollide(this.bb, xa);
        }
        this.bb.move(xa, 0, 0);
        for (let aabb of aabbs) {
            ya = aabb.clipYCollide(this.bb, ya);
        }
        this.bb.move(0, ya, 0);
        for (let aabb of aabbs) {
            za = aabb.clipZCollide(this.bb, za);
        }
        this.bb.move(0, 0, za);
        this.wasCollision = new wasCollisionContext(ogXa !== xa, ogYa !== ya, ogZa !== za);
        this.pos = vec3.fromValues((this.bb.x0 + this.bb.x1) / 2, this.bb.y0, (this.bb.z0 + this.bb.z1) / 2);
        if (this.wasCollision.x)
            this.velocity[0] = this.getBounce()[0] * -this.velocity[0];
        if (this.wasCollision.y)
            this.velocity[1] = this.getBounce()[1] * -this.velocity[1];
        if (this.wasCollision.z)
            this.velocity[2] = this.getBounce()[2] * -this.velocity[2];
        // if (this instanceof EntityPlayerServer)
        // console.log(xa, ya, za)
    }
    posX() {
        return this.pos[0];
    }
    posY() {
        return this.pos[1];
    }
    posZ() {
        return this.pos[2];
    }
    velocityX() {
        return this.velocity[0];
    }
    velocityY() {
        return this.velocity[1];
    }
    velocityZ() {
        return this.velocity[2];
    }
    setPos(x, y, z) {
        this.bb = new AABB(x - this.size[0] / 2, y, z - this.size[0] / 2, x + this.size[0] / 2, y + this.size[1], z + this.size[0] / 2);
        this.pos = vec3.fromValues(x, y, z);
    }
    getRenderPos(partialTicks) {
        // if (this.ticksAlived <= 1) return this.pos;
        const x = MathUtil.lerp(partialTicks, this.oldPos[0], this.pos[0]);
        const y = MathUtil.lerp(partialTicks, this.oldPos[1], this.pos[1]);
        const z = MathUtil.lerp(partialTicks, this.oldPos[2], this.pos[2]);
        return vec3.fromValues(x, y, z);
    }
    isOnWall(x = this.posX(), y = this.posY(), z = this.posZ(), cubes = this.getCollides()) {
        for (const cube of cubes)
            if (new AABB(0, 0, 0, 0, 0, 0).initBySize(this.size).move(x, y + 0.001, z).overlap(cube))
                return true;
        return false;
    }
    trace(start, normal) {
        const cubes = this.getCollides();
        let lastPos = start;
        for (let i = 0; i <= 1; i += 1 / vec3.len(normal)) {
            const dis = vec3Util.tomul(normal, i);
            const moved = vec3.add(vec3.create(), start, dis);
            if (this.isOnWall(moved[0], moved[1], moved[2], cubes)) {
                return lastPos;
            }
            lastPos = moved;
        }
        return lastPos;
    }
    simpleOverlap() {
        if (this.bb == null)
            return false;
        let aabbs = this.getCollides();
        for (let aabb of aabbs) {
            if (aabb.overlap(this.bb))
                return true;
        }
        return false;
    }
    moveRotate(degree) {
        let rotation = this.rotation.get();
        if (degree < 0 && rotation > 90)
            rotation -= 360;
        if (degree > 90 && rotation < 0)
            rotation += 360;
        rotation += (degree - rotation) * 0.25;
        this.rotation.set(rotation);
        // console.log(this.rotation, this.rotation % 180, degree)
        // this.rotation %= 180;
    }
    moveRotateByVelocity(x, y, z, offsetDegree = 0) {
        const d = MathUtil.calcAngleDegrees(z, x);
        this.moveRotate(d + offsetDegree);
    }
    moveRotateToTarget(x, y, z, offsetDegree = 0) {
        const dx = x - this.pos[0];
        const dy = y - this.pos[1];
        const dz = z - this.pos[2];
        const d = MathUtil.calcAngleDegrees(dz, dx);
        this.moveRotate(d + offsetDegree);
    }
    /**@deprecated */
    getScale() {
        return vec3.fromValues(1, 1, 1);
    }
    getGrovalAlpha(partialTicks) {
        return this.isAlive() ? 1 : 0.5;
    }
    /** call on render do not override this method */
    getRenderOverlayColor(partialTicks) {
        return this.getOverlayColor(partialTicks);
    }
    /** default color getter do not call this method */
    getOverlayColor(partialTicks) {
        return vec4.fromValues(0, 0, 0, 0);
    }
    setupVertices(verticesData, partialTicks, cam) {
        for (let cube of this.getRenderCubes(partialTicks)) {
            const leftIndex = verticesData.indices[verticesData.indices.length - 1];
            const offset = leftIndex == null ? 0 : leftIndex + 1;
            verticesData.position.push(...cube.getRotatedVertcies());
            verticesData.textureCoord.push(...cube.getTextureUVs());
            verticesData.textureVarious.push(...cube.getTextureVarious());
            verticesData.indices.push(...cube.getTextureIndices(offset));
        }
    }
    setupDebugLineVertices(verticesData, partialTicks, clientIn, serverIn) {
        if (Core.debugBBRender && this.bb) {
            const { x0, y0, z0, x1, y1, z1 } = this.bb;
            const vertices = [
                // Bottom face
                x0, y0, z0,
                x1, y0, z0,
                x1, y0, z1,
                x0, y0, z1,
                // Top face
                x0, y1, z0,
                x1, y1, z0,
                x1, y1, z1,
                x0, y1, z1,
            ];
            const offset = verticesData.position.length / 3;
            verticesData.position.push(...vertices);
            const indices = [
                0, 1, 1, 2, 2, 3, 3, 0, // Bottom face
                4, 5, 5, 6, 6, 7, 7, 4, // Top face
                0, 4, 1, 5, 2, 6, 3, 7 // Vertical lines
            ].map(index => index + offset);
            verticesData.indices.push(...indices);
            for (let index = 0; index < 2 * 12; index++) {
                verticesData.textureColor.push(...Color.RED);
            }
        }
        // console.log(verticesData)
    }
    getRenderCubes(partialTicks) {
        return [
            Entity.cubeHead,
            Entity.cubeNose
        ];
    }
    getRenderTexture(partialTicks) {
        return [textures.get("stone")];
    }
    getRenderRotation(partialTicks) {
        const rotation = MathUtil.rotLerp(partialTicks, this.oldRotation, this.rotation.get());
        const rotationDeath = this instanceof EntityLiving && !this.isAlive() ? 1 - Math.pow(2, -10 * (this.deathTime + partialTicks) / EntityLiving.deathDisapperTime) : 0;
        // if (this instanceof EntityLiving && !this.isAlive()) console.log(1 - Math.pow(2, -10 * (this.deathTime + partialTicks) / EntityLiving.deathDisapperTime))
        return vec3.fromValues(rotationDeath * 90, rotation, 0);
    }
    setScreenPos(x, y) {
        this.screenPos = vec2.fromValues(x, y);
    }
    getScreenText() {
        return null;
    }
    equals(entity) {
        return this.uuid == (entity === null || entity === void 0 ? void 0 : entity.uuid);
    }
    canDespawn() {
        return false;
    }
    isDespawnProtection() {
        return false;
    }
    checkDespawn(gameIn) {
        if (!this.canDespawn())
            return;
        const isInRange = gameIn.entities.filter(e => e.isDespawnProtection()).some(e => vec3.dist(this.pos, e.pos) < Entity.DESPAWN_RANGE);
        if (isInRange)
            return;
        // console.log(this, "was despawned")
        if (MathUtil.randomInt(0, 100) == 0)
            this.discard(gameIn);
    }
}
Entity.ROTATION_ID = 0x00;
Entity.HEALTH_ID = 0x10;
Entity.getParentKey = true;
Entity.ATTACK_ID = 0x20;
Entity.SPRINT_ID = 0x21;
Entity.IS_SPRINTING_ID = 0x22;
Entity.IS_SPRINTING_OR_COOLDOWN_ID = 0x23;
Entity.IS_XP_POINT_ID = 0x24;
Entity.IS_XP_LEVEL_ID = 0x25;
Entity.POWER_LEVEL_ID = 0x20;
Entity.SHOOT_EVENT_ID = 0x21;
Entity.BASE_SCALE = 1 / 16;
Entity.cubeHead = new CubePlayerHead(-0.5, -0.5, -0.5, 0.5, 0.5, 0.5);
Entity.cubeNose = new CubePlayerHead(-0.1, 0.4, 0.0, 0.1, 0.6, 0.5);
Entity.DESPAWN_RANGE = 20;
const HURT_COOLDOWN = 10;
class EntityLiving extends Entity {
    constructor(gameIn) {
        super(gameIn);
        // maxHealth: number = 100;
        this.damageCooldown = 0;
        this.clientHurtTime = 0;
        this.deathTime = 0;
        this.health = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, Entity.HEALTH_ID, 100, this));
    }
    getMaxHealth() {
        return 100;
    }
    tick(gameIn) {
        super.tick(gameIn);
        this.damageCooldown--;
        this.clientHurtTime--;
        if (!this.isAlive()) {
            this.deathTime++;
            if (this.deathTime >= EntityLiving.deathDisapperTime && Core.debugDoDiscardOnDeath) {
                gameIn.spawnKillEffectEvent.trigger(this.pos, this.size[0]);
                this.dropLoots(gameIn);
                this.discard(gameIn);
            }
        }
    }
    isAlive() {
        return this.health.get() > 0;
    }
    isInDamageCooldown() {
        return this.damageCooldown > 0;
    }
    canHurt() {
        return this.isAlive();
    }
    heal(amount, gameIn) {
        const healedHealth = Math.min(this.health.get() + amount, this.getMaxHealth());
        this.health.set(healedHealth);
        if (gameIn instanceof Server) {
            this.updateHealth(gameIn);
        }
    }
    hurt(damage, attacker, gameIn) {
        if (this.isInDamageCooldown() || !this.canHurt())
            return false;
        this.damageCooldown = 10;
        const damagedHealth = this.health.get() - damage;
        this.health.set(damagedHealth);
        if (attacker != null) {
            const moveX = Math.sign(this.pos[0] - attacker.pos[0]);
            const moveZ = Math.sign(this.pos[2] - attacker.pos[2]);
            this.addVelocity(moveX, 0, moveZ);
            if (!this.isAlive()) {
                this.addVelocity(moveX * 0.217, 0.5, moveZ * 0.217);
            }
        }
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        if (gameIn instanceof Server) {
            gameIn.sendAll(new PacketToClientHurtAnimation(this.uuid));
            this.updateHealth(gameIn);
        }
        // console.log(value, attacker);
        return true;
    }
    updateHealth(serverIn) {
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        // serverIn.sendAll({ msgType: "updateEntityHealth", health: this.health.get(), maxHealth: this.maxHealth, entityUUID: this.uuid });
    }
    HurtAnimationStart() {
        this.clientHurtTime = 10;
    }
    getRenderOverlayColor(partialTicks) {
        return this.clientHurtTime > 0 || !this.isAlive() ? this.getHurtColor(partialTicks) : this.getOverlayColor(partialTicks);
    }
    getHurtColor(partialTicks) {
        return vec4.fromValues(1, 0, 0, 0.5);
    }
    dropLoots(gameIn) { }
    travel(gameIn) {
        // this.addVelocity(0, -this.getGravity(), 0);
        super.travel(gameIn);
    }
    getGravity() {
        return 0.5;
    }
    getFriction() {
        if (!this.isAlive())
            return 0.7;
        return super.getFriction();
    }
}
EntityLiving.deathDisapperTime = 20;
class EntityPlayer extends EntityLiving {
    // health = Number.MAX_VALUE;
    constructor(gameIn) {
        super(gameIn);
        this.size = vec2.fromValues(1, 2);
        this.speed = 0.3;
        // sendCreatePacket(serverIn: Server, client: undefined, msgObj = {}) {
        // super.sendCreatePacket(serverIn, client, Object.assign(msgObj, { userName: this.userName }))
        // }
        // recreateByPacket({ posX, posY, posZ, entityUUID, rotation, userName }: { posX: number, posY: number, posZ: number, entityUUID: UUID, rotation: number, userName: string }) {
        // super.recreateByPacket({ posX, posY, posZ, entityUUID, rotation });
        // this.userName = userName;
        // return this;
        // }
        this.attackTime = 0;
        this.isAttacking = false;
        this.sprintTick = 0;
        this.sprintCooldown = 0;
        this.sprintingOrInCooldownTick = 0;
        this.rotation = this.syncManager.register(new EntityDataSyncProperty(Side.CLIENT, Entity.ROTATION_ID, 0, this));
        this.attackEvent = this.syncManager.register(new EntityEventSyncProperty(Side.CLIENT, EntityPlayer.ATTACK_ID, data => this.tryAttack(gameIn), this));
        this.sprintEvent = this.syncManager.register(new EntityEventSyncProperty(Side.CLIENT, EntityPlayer.SPRINT_ID, data => this.trySprint(gameIn), this));
        this.isSprinting = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityPlayer.IS_SPRINTING_ID, 0, this, entity => entity != this));
        this.isSprintingOrInCooldown = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityPlayer.IS_SPRINTING_OR_COOLDOWN_ID, 0, this, entity => entity != this));
        this.xpPoint = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityPlayer.IS_XP_POINT_ID, 0, this));
        this.xpLevel = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityPlayer.IS_XP_LEVEL_ID, 1, this));
        this.health.set(this.getMaxHealth());
    }
    tick(gameIn) {
        super.tick(gameIn);
        if (this.isAttacking) {
            this.attackTime++;
            if (this.attackTime >= 10) {
                this.attackTime = 0;
                this.isAttacking = false;
            }
        }
        this.checkSprint(gameIn);
    }
    triggerOnPlayerMove(gameIn) {
        for (const entity of gameIn.entities) {
            entity.onPlayerMove(this, gameIn);
        }
    }
    sendMovePacket(gameIn) {
    }
    getAttackEntities(gameIn) {
        const offset = 1;
        const radian = MathUtil.toRadian(this.rotation.get());
        const offsetX = Math.sin(radian) * offset + this.pos[0];
        const offsetY = this.pos[1];
        const offsetZ = Math.cos(radian) * offset + this.pos[2];
        const checkbb = new AABB(0, 0, 0, 0, 0, 0).initBySize(vec2.fromValues(3, 1)).toMoved(offsetX, offsetY, offsetZ);
        const entities = gameIn.entities.getCollideWith(checkbb).getOnlyClass(EntityEnemy).filter(e => e.canHurt());
        return entities;
    }
    isDespawnProtection() {
        return true;
    }
    getAttackDamage() {
        return this.xpLevel.get() * 3 + 10;
    }
    getMaxHealth() {
        return this.xpLevel.get() * 10 + 100;
    }
    respawn(gameIn) {
    }
    tryAttack(gameIn) {
    }
    updateXpLevel(newLevel) {
        if (this.xpLevel.get() == newLevel)
            return;
        const difHl = this.getMaxHealth() - this.health.get(); // レベルが上がっても最大体力の差を保持する
        this.xpLevel.set(newLevel);
        this.health.set(this.getMaxHealth() - difHl);
    }
    growXpPoint(amount) {
        const xpPoint = this.xpPoint.get() + amount;
        this.xpPoint.set(xpPoint);
        this.checkUpdateXpLevel();
    }
    getMaxXpPoint() {
        return this.xpLevel.get() * 21.7 + 21.7;
    }
    checkUpdateXpLevel() {
        const maxXpPoint = this.getMaxXpPoint();
        if (this.xpPoint.get() >= maxXpPoint) {
            this.xpPoint.set(this.xpPoint.get() - maxXpPoint);
            this.updateXpLevel(this.xpLevel.get() + 1);
        }
    }
    canSprint() {
        return this.sprintCooldown <= 0 && !this.isSprinting.get();
    }
    trySprint(gameIn) {
        if (!this.canSprint())
            return false;
        this.isSprinting.set(1);
        this.isSprintingOrInCooldown.set(1);
        return true;
    }
    checkSprint(gameIn) {
        if (gameIn instanceof Client)
            this.checkSpawnSprintParticle(gameIn);
        if (this.sprintCooldown > 0) {
            this.sprintCooldown--;
        }
        else if (!this.isSprinting.get()) {
            this.isSprintingOrInCooldown.set(0);
        }
        if (this.isSprintingOrInCooldown.get()) {
            this.sprintingOrInCooldownTick++;
        }
        else {
            this.sprintingOrInCooldownTick = 0;
        }
        if (this.isSprinting.get()) {
            this.sprintTick++;
            if (this.sprintTick >= EntityPlayer.SPRINT_BOOST_TIME) {
                this.sprintTick = 0;
                this.sprintCooldown = EntityPlayer.SPRINT_COOLDOWN;
                this.isSprinting.set(0);
            }
        }
    }
    checkSpawnSprintParticle(clientIn) {
        if (this.isSprinting.get() || this.isSprintingOrInCooldown.get() && this.movedDis > 1) {
            const particleF = new ParticleSprintFire(vec3Util.add(vec3.create(), this.pos, 0, 0.1, 0), vec3Util.tomul(this.velocity, -1));
            particleF.spawn(clientIn);
            for (let index = 0; index < 3; index++) {
                const particleS = new ParticleSprintSmoke(vec3Util.add(vec3.create(), this.pos, 0, 0.1, 0));
                particleS.spawn(clientIn);
            }
        }
    }
    getFixedMovedDisForAnim(partialTicks) {
        let fixedMovedDis = MathUtil.lerp(partialTicks, this.oldMovedDis, this.movedDis);
        if (this.isSprintingOrInCooldown.get())
            fixedMovedDis /= 25;
        return fixedMovedDis;
    }
    getWalkRot(speed, scale, partialTicks) {
        const totalMovedDis = MathUtil.lerp(partialTicks, this.totalMovedDis - this.movedDis, this.totalMovedDis);
        const movedDis = this.getFixedMovedDisForAnim(partialTicks);
        return Math.sin((totalMovedDis % (Math.PI * 2)) * speed) * scale * movedDis;
    }
    getRenderCubes(partialTicks) {
        let fixedMovedDis = this.getFixedMovedDisForAnim(partialTicks) * 50;
        let deltaSprintTick = this.isSprintingOrInCooldown.get() ? this.sprintingOrInCooldownTick + partialTicks : 0;
        const sprintArmRot = Math.abs(Math.cos(deltaSprintTick / (EntityPlayer.SPRINT_BOOST_TIME + EntityPlayer.SPRINT_COOLDOWN) * Math.PI)) * 80;
        const armRot = sprintArmRot - 20;
        let leftLegPitch = this.getWalkRot(1.0, 100, partialTicks);
        let rightLegPitch = this.getWalkRot(1.0, -100, partialTicks);
        let leftArmPitch = 0;
        let rightArmPitch = 0;
        let leftArmYaw = this.getWalkRot(1.0, 100, partialTicks);
        let rightArmYaw = this.getWalkRot(1.0, 100, partialTicks);
        let leftArmRoll = this.getWalkRot(0.5, 30, partialTicks) - armRot + fixedMovedDis;
        let rightArmRoll = this.getWalkRot(0.5, 30, partialTicks) + armRot - fixedMovedDis;
        let attackTime = this.attackTime;
        if (this.isAttacking)
            attackTime += partialTicks;
        if (attackTime >= 5)
            attackTime = 0;
        const attackRot = Math.sin(attackTime / 5 * Math.PI);
        rightArmPitch -= attackRot * 200;
        rightArmYaw -= attackRot * 5;
        rightArmRoll -= attackRot * 50;
        const armSize = 8;
        const weaponSize = 12;
        const weaponOffset = 1;
        const weaponRotationMat = Renderer.rotationMatrix(rightArmPitch, rightArmYaw, rightArmRoll);
        const weaponRotatedPoint = Renderer.rotatePointAroundCenter(vec3.fromValues(-(4 + armSize - weaponOffset), 11, 0), weaponRotationMat, vec3.fromValues(-4, 10.5, 0));
        return [
            new Cube(-4, 12, -4, 4, 20, 4).setTexture(64, 64, 0, 0).toScaledWithCenter(1.5, 1.5, 1.5, 0, 12, 0),
            new Cube(-4, 12, -4, 4, 20, 4).setTexture(64, 64, 32, 0).toScaledWithCenter(1.5, 1.5, 1.5, 0, 12, 0).toScaledWithCenter(1.1, 1.1, 1.1, 0, 16, 0),
            new Cube(-4, 0, -2, 0, 6, 2).setTexture(64, 64, 24, 16).addThisRotate(rightLegPitch, 0, 0, 0, 4, 0),
            new Cube(0, 0, -2, 4, 6, 2).setTexture(64, 64, 24, 16).addThisRotate(leftLegPitch, 0, 0, 0, 4, 0),
            new Cube(-4, 6, -2, 4, 12, 2).setTexture(64, 64, 0, 16),
            new Cube(-4 - armSize, 9, -1.5, -4, 12, 1.5).setTexture(64, 64, 40, 16).addThisRotate(rightArmPitch, rightArmYaw, rightArmRoll, -4, 12, 0),
            new Cube(4, 9, -1.5, 4 + armSize, 12, 1.5).setTexture(64, 64, 40, 16, true).addThisRotate(leftArmPitch, leftArmYaw, leftArmRoll, 4, 12, 0),
            // new Cube(-(4 + armSize - weaponOffset + weaponSize), 10.5, -0.5, -(4 + armSize - weaponOffset), 11.5, 0.5).setTexture(64, 64, 0, 30).addThisRotate(rightArmPitch, rightArmYaw, rightArmRoll, -4, 12, 0).addThisRotate(0, -90, 0, weaponRotatedPoint[0], weaponRotatedPoint[1], weaponRotatedPoint[2])
        ];
    }
    getRenderTexture(partialTicks) {
        return [textures.get("player")];
    }
    getSecondRenderCubes(partialTicks) {
        return [];
    }
    getSecondRenderTexture(partialTicks) {
        return [textures.get("playerWeapon")];
    }
}
EntityPlayer.SPRINT_KEY_INTERVAL = 5;
EntityPlayer.SPRINT_COOLDOWN = 10;
EntityPlayer.SPRINT_SPEED = 1;
EntityPlayer.SPRINT_BOOST_TIME = 5;
class EntityPlayerServer extends EntityPlayer {
    constructor(serverIn, serverClient) {
        super(serverIn);
        this.shouldUpdateHealth = false;
        this.serverIn = serverIn;
        this.serverClient = serverClient;
    }
    tick(serverIn) {
        super.tick(serverIn);
    }
    canMove() {
        return false;
    }
    addVelocity(x, y, z) {
        super.addVelocity(x, y, z);
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        this.serverIn.sendAll(new PacketToClientEntityVelocity(this.uuid, this.velocity[0], this.velocity[1], this.velocity[2]));
    }
    setVelocity(x, y, z) {
        super.setVelocity(x, y, z);
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        this.serverIn.sendAll(new PacketToClientEntityVelocity(this.uuid, this.velocity[0], this.velocity[1], this.velocity[2]));
    }
    setPos(x, y, z) {
        super.setPos(x, y, z);
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        this.serverIn.sendAll(new PacketToClientEntityMove(this.uuid, this.pos[0], this.pos[1], this.pos[2]));
    }
    tryAttack(serverIn) {
        const damage = this.getAttackDamage();
        const entities = this.getAttackEntities(serverIn);
        // console.log(checkbb)
        // console.log(entities)
        entities.hurtAll(damage, this, serverIn);
    }
    hurt(value, attacker, gameIn) {
        this.shouldUpdateHealth = true;
        return super.hurt(value, attacker, gameIn);
    }
    heal(amount, gameIn) {
        this.shouldUpdateHealth = true;
        return super.heal(amount, gameIn);
    }
    discard(serverIn) {
        if (this.uuid == null)
            throw Error("Bug detected! " + "uuid is null");
        serverIn.sendAll(new PacketToClientDeletePlayerData(this.uuid));
        return super.discard(serverIn);
    }
    playerServerEvent(serverIn, msg) {
        if (msg.event == "sprint") {
            const result = this.trySprint(serverIn);
            // console.log("sprint", result)
        }
    }
    getSpawnPoint(erverIn) {
        return vec3.fromValues(0, 0, 0);
    }
    respawn(gameIn) {
        if (this.isAlive())
            return;
        if (gameIn instanceof Server) {
            gameIn.spawnPlayer(this.serverClient, this.userName);
        }
    }
}
class EntityPlayerOtherClient extends EntityPlayer {
}
class EntityPlayerClient extends EntityPlayer {
    constructor(clientIn) {
        super(clientIn);
        this.playersData = new PlayerData(0, 0, undefined);
        this.sprintVel = vec3.fromValues(0, 0, 0);
        this.elapsedLastKeysDownTime = [0, 0, 0, 0];
        this.clientIn = clientIn;
    }
    tick(clientIn) {
        super.tick(clientIn);
        if (this.isControlable(clientIn)) {
            this.moveToControl(clientIn);
            this.checkAttack(clientIn);
        }
    }
    sendMovePacket(gameIn) {
        if (gameIn instanceof Client) {
            gameIn.send(new PacketToServerPlayerMove(this.pos[0], this.pos[1], this.pos[2]));
        }
    }
    sendRotatePacket(gameIn) {
        if (gameIn instanceof Client) {
            // gameIn.send({ msgType: "entityRotate", rotation: this.rotation.get(), entityUUID: this.uuid });
        }
    }
    isControlable(clientIn) {
        if (Core.debugFreeCam)
            return false;
        if (this != clientIn.entityPlayer)
            return false;
        if (clientIn.currentGui != null && !clientIn.currentGui.isControlable())
            return false;
        if (!this.isAlive())
            return false;
        return true;
    }
    moveToControl(clientIn) {
        if (Core.debugFreeCam)
            return;
        const speed = this.speed;
        const moveVel = vec3.fromValues(0, 0, 0);
        if (clientIn.keyHandler.keyLeft.isDown)
            moveVel[0]++;
        if (clientIn.keyHandler.keyRight.isDown)
            moveVel[0]--;
        if (clientIn.keyHandler.keyUp.isDown)
            moveVel[2]++;
        if (clientIn.keyHandler.keyDown.isDown)
            moveVel[2]--;
        const fixedVel = MathUtil.rotatedMove(moveVel, clientIn.cam.dir[1], speed);
        this.addVelocity(fixedVel[0], fixedVel[1], fixedVel[2]);
        const isMoved = vec3.len(moveVel) != 0;
        if (isMoved) {
            this.oldRotation = this.rotation.get();
            this.moveRotateByVelocity(moveVel[0], moveVel[1], moveVel[2], clientIn.cam.dir[1]);
            clientIn.cam.moveYawByPlayerVel(moveVel[0], moveVel[1], Math.abs(moveVel[2]), clientIn.cam.dir[1]);
            this.triggerOnPlayerMove(clientIn);
        }
    }
    trySprint(gameIn, sprintVel) {
        const result = super.trySprint(gameIn);
        if (result && gameIn instanceof Client && sprintVel != null) {
            this.sprintEvent.trigger(0);
            // this.sendEventPacket(gameIn, EntityEventTypes.PLAYER_SPRINT, 0)
            this.sprintVel = sprintVel;
        }
        return result;
    }
    checkSprint(clientIn) {
        if (!this.isControlable(clientIn))
            return;
        const moveVel = vec3.fromValues(0, 0, 0);
        const keys = new Map;
        keys.set(clientIn.keyHandler.keyLeft, vec3.fromValues(1, 0, 0));
        keys.set(clientIn.keyHandler.keyRight, vec3.fromValues(-1, 0, 0));
        keys.set(clientIn.keyHandler.keyUp, vec3.fromValues(0, 0, 1));
        keys.set(clientIn.keyHandler.keyDown, vec3.fromValues(0, 0, -1));
        let i = 0;
        let sprinted = false;
        for (const [key, vel] of keys.entries()) {
            this.elapsedLastKeysDownTime[i]--;
            if (key.isPressStarted) {
                if (this.elapsedLastKeysDownTime[i] > 0) {
                    moveVel[0] += vel[0];
                    moveVel[1] += vel[1];
                    moveVel[2] += vel[2];
                    sprinted || (sprinted = true);
                }
                this.elapsedLastKeysDownTime[i] = EntityPlayer.SPRINT_KEY_INTERVAL;
            }
            i++;
        }
        const fixedVel = MathUtil.rotatedMove(moveVel, clientIn.cam.dir[1], EntityPlayer.SPRINT_SPEED);
        // fixedVel[1] = 3;
        if (sprinted) {
            this.trySprint(clientIn, fixedVel);
        }
        super.checkSprint(clientIn);
        if (this.isSprinting.get()) {
            this.addVelocity(this.sprintVel[0], this.sprintVel[1], this.sprintVel[2]);
        }
    }
    checkAttack(clientIn) {
        while (clientIn.keyHandler.keyAttack.consumeClick())
            this.attackEvent.trigger(0);
    }
    tryAttack(clientIn) {
        const entities = this.getAttackEntities(clientIn);
        if (entities.length > 0) {
            this.isAttacking = true;
        }
        this.attackEvent.trigger(0);
        // clientIn.send({ msgType: "playerAttack" });
    }
    sendEventPacket(gameIn, id, data) {
        super.sendEventPacket(gameIn, id, data);
        if (gameIn instanceof Client) {
            // gameIn.send({ msgType: "playerEvent", id: id, data: data });
        }
    }
}
class PlayerData {
    constructor(health, maxHealth, name) {
        this.health = health;
        this.maxHealth = maxHealth;
        this.name = name;
    }
}
class EntityXp extends Entity {
    constructor(gameIn, amount = 0) {
        super(gameIn);
        this.amount = amount;
        this.size = vec2.fromValues(1, 1);
        this.olderPos = vec3.fromValues(NaN, NaN, NaN);
        this.syncVelocity = true;
    }
    tick(gameIn) {
        this.olderPos[0] = this.oldPos[0];
        this.olderPos[1] = this.oldPos[1];
        this.olderPos[2] = this.oldPos[2];
        super.tick(gameIn);
        trySpawnParticle: if (gameIn instanceof Client && !gameIn.options.reduceParticles) {
            const distanceParParticle = 0.4 / this.movedDis;
            if (distanceParParticle > 1)
                break trySpawnParticle;
            let count = 0;
            for (let i = 0; i <= 1; i += distanceParParticle) {
                const particle = new ParticleXpShadow(vec3.lerp(vec3.create(), this.olderPos, this.oldPos, i));
                particle.spawn(gameIn);
                count++;
            }
            // console.log(count)
        }
    }
    onPlayerMove(player, gameIn) {
        super.onPlayerMove(player, gameIn);
        const collectDIst = 1 + 1.217 * player.movedDis; // プレイヤーの速度が速いと回収範囲が大きくなる
        if (vec3.dist(this.pos, player.pos) < collectDIst && gameIn instanceof Server) {
            player.growXpPoint(this.amount);
            this.discard(gameIn);
        }
    }
    gravityTick() {
        this.velocity[1] -= 0.5;
    }
    getOverlayColor(partialTicks) {
        const totalTicks = this.ticksAlived + partialTicks;
        return vec4.fromValues(0, .5, 1, Math.sin(totalTicks / 4) / 2);
    }
    setupVertices(verticesData, partialTicks, cam) {
        if (cam == null)
            throw Error("bug detected!" + "cam is null");
        const centerPos = vec3.fromValues(0, 0.5, 0);
        const sizeNum = Math.min(this.amount * 0.05 + 4, 8);
        const size = vec2.fromValues(sizeNum, sizeNum);
        const textureLeftTop = vec2.fromValues(0, 0);
        const textureSize = vec2.fromValues(1, 1);
        Renderer.addBillboardToVertices(centerPos, size, textureLeftTop, textureSize, partialTicks, [new RotationPointContext(-cam.dir[0], cam.dir[1], 0, centerPos)], verticesData);
    }
    getRenderCubes(partialTicks) {
        return [
            new Cube(-0.5, 0, -0.5, 0.5, 1, 0.5).setTexture(64, 64, 16, 0)
        ];
    }
    getRenderTexture(partialTicks) {
        return [textures.get("xp")];
    }
    getFriction() {
        return this.wasCollision.y ? 0.7 : 0.9;
    }
    // sendCreatePacket(serverIn: Server, client: undefined, msgObj = {}) {
    // const msgBase = { amount: this.amount };
    // super.sendCreatePacket(serverIn, client, msgBase);
    // }
    // recreateByPacket({ posX, posY, posZ, entityUUID, rotation, amount }: { posX: number, posY: number, posZ: number, entityUUID: UUID, rotation: number, amount: number }) {
    // super.recreateByPacket({ posX, posY, posZ, entityUUID, rotation });
    // this.amount = amount ?? 0;
    // return this;
    // }
    static getOneSplittedXp(xp) {
        return xp / MathUtil.random(4, 8);
    }
    static splittingXp(xp) {
        const result = [];
        for (let i = 0, additional = this.getOneSplittedXp(xp); i < xp; additional = this.getOneSplittedXp(xp), i += additional) {
            const fixedAmount = Math.min(additional, xp - i);
            result.push(fixedAmount);
        }
        return result;
    }
}
class EntityEnemy extends EntityLiving {
    constructor(gameIn) {
        super(gameIn);
        this.size = vec2.fromValues(1, 2);
        this.speed = 0.1;
        this.target = null;
        this.noMovedTick = 0;
        this.lastMovedCount = 0;
        this.lastMovedCountZeroTick = 0;
        this.lastMovedIndexes = [];
        this.isPathfinding = false;
        this.pathfindResult = [];
        this.powerLevel = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityEnemy.POWER_LEVEL_ID, 1, this));
    }
    dropLoots(gameIn) {
        if (gameIn instanceof Server) {
            for (const xpAmount of EntityXp.splittingXp(this.powerLevel.get() * 10)) {
                const xp = new EntityType.XP(gameIn, xpAmount);
                xp.setPos(this.pos[0], this.pos[1], this.pos[2]);
                xp.addVelocity(MathUtil.random(-0.5, 0.5), 2.5, MathUtil.random(-0.5, 0.5));
                xp.spawn(gameIn);
            }
        }
    }
    canDespawn() {
        return true;
    }
    tick(gameIn) {
        super.tick(gameIn);
        if (gameIn instanceof Server) {
            // console.log(this.isPathfinding, this.pathfindResult, this.lastMovedCount)
            // console.log(this.pos)
            if (this.lastMovedCount <= 1) {
                if (this.lastMovedCountZeroTick >= 50)
                    this.resetPathfind();
                this.lastMovedCountZeroTick++;
            }
            if (this.pathfindResult.length == 0)
                this.resetPathfind();
            if (this.noMovedTick > 25)
                this.resetPathfind();
            this.goToTargetCheck(gameIn);
            this.targetFindAndForgetCheck(gameIn);
        }
        this.rotateEntity(gameIn);
    }
    travel(gameIn) {
        super.travel(gameIn);
        let count = 0;
        this.lastMovedIndexes.splice(0);
        let index = 0;
        for (const node of this.pathfindResult) {
            const dis = MathUtil.getDistance2(this.pos[0], this.pos[2], node.x, node.y);
            if (dis > 1) {
                index++;
                continue;
            }
            // const index = this.pathfindResult.indexOf(node);
            // console.log(dis, index, node[0], node[1])
            if (this.pathfindResult.length <= index + 1) {
                this.resetPathfind();
                return;
            }
            const nextNode = this.pathfindResult[index + 1];
            const speed = this.speed;
            if (nextNode.x - this.pos[0] > 0)
                this.addVelocity(speed, 0, 0);
            if (nextNode.x - this.pos[0] < 0)
                this.addVelocity(-speed, 0, 0);
            if (nextNode.y - this.pos[2] > 0)
                this.addVelocity(0, 0, speed);
            if (nextNode.y - this.pos[2] < 0)
                this.addVelocity(0, 0, -speed);
            count++;
            this.lastMovedIndexes.push(index);
            index++;
        }
        this.noMovedTick++;
        if (this.lastMovedCount != count)
            this.noMovedTick = 0;
        this.lastMovedCount = count;
        // if (this.pathfindResult.length != 0) console.warn("pathfind: node was not found")
    }
    goToTargetCheck(serverIn) {
        if (this.isPathfinding)
            return false;
        if (this.target != null) {
            if (this.getDistanceByEntity(this.target) >= this.getFindableDistance())
                return false;
            this.pathfindToEntity(this.target);
            return true;
        }
        return false;
    }
    targetFindAndForgetCheck(serverIn) {
        if (this.isPathfinding) {
            const target = this.target;
            if (this.target != null && this.getHorizontalDistanceByEntity(this.target) >= this.getForgetDistance())
                this.resetPathfind();
            if (this.isPathfinding)
                return false;
        }
        ;
        for (const target of serverIn.entities.copy().sort(Util.getSorterEntityDistanceBy(this))) {
            if (MathUtil.getDistance2(this.pos[0], this.pos[2], target.pos[0], target.pos[2]) >= this.getFindableDistance())
                continue;
            if (target instanceof EntityPlayer) {
                this.target = target;
                return true;
            }
        }
        return false;
    }
    rotateEntity(gameIn) {
        if (this.target != null) {
            this.moveRotateToTarget(this.target.pos[0], this.target.pos[1], this.target.pos[2], 0);
        }
    }
    pathfindTo(x, z) {
        const cubes = this.getCollides();
        const getWeight = (x, y) => this.isOnWall(x, 2, y, cubes) ? Infinity : 1;
        if (getWeight(Math.round(x), Math.round(z)) == Infinity)
            return []; // 壁に埋まっている場合
        if (MathUtil.getDistance2(x, z, this.pos[0], this.pos[2]) <= 1)
            return []; // 近すぎる場合
        if (MathUtil.getDistance2(x, z, this.pos[0], this.pos[2]) > 100)
            return []; // 遠すぎる場合
        // console.log("pathfinding",x,z);
        const start = new PathfindNode(Math.round(this.pos[0]), Math.round(this.pos[2]));
        const end = new PathfindNode(x, z);
        this.isPathfinding = true;
        this.pathfindResult = astar(start, end, getWeight);
        return this.pathfindResult;
    }
    pathfindToEntity(target) {
        if (vec3.dist(this.pos, target.pos) >= this.getPathFindableDistance())
            return;
        return this.pathfindTo(Math.round(target.pos[0]), Math.round(target.pos[2]));
    }
    resetPathfind() {
        this.pathfindResult = [];
        this.isPathfinding = false;
        this.lastMovedCountZeroTick = 0;
    }
    getPathFindableDistance() {
        return this.getForgetDistance();
    }
    getFindableDistance() {
        return 25;
    }
    getForgetDistance() {
        return 40;
    }
    // sendCreatePacket(serverIn: Server, client: undefined, msgObj = {}) {
    // const msgBase = { powerLevel: this.powerLevel };
    // super.sendCreatePacket(serverIn, client, msgBase);
    // }
    // recreateByPacket({ posX, posY, posZ, entityUUID, rotation, powerLevel }: { posX: number, posY: number, posZ: number, entityUUID: UUID, rotation: number, powerLevel: number }) {
    // super.recreateByPacket({ posX, posY, posZ, entityUUID, rotation });
    // this.powerLevel = powerLevel ?? 0;
    // return this;
    // }
    getAttackDamage() {
        return this.powerLevel.get() * 3;
    }
    getMaxHealth() {
        return this.powerLevel.get() * 10;
    }
    getPowerLevelByDistance(dis) {
        return Math.ceil(dis / 10);
    }
    setPowerLevelAndUpdate(dis) {
        this.powerLevel.set(this.getPowerLevelByDistance(dis));
        //update Health
        const health = this.getMaxHealth();
        this.health.set(health);
    }
    getScreenText() {
        return "lv" + this.powerLevel.get();
    }
    setupDebugLineVertices(verticesData, partialTicks, clientIn, serverIn) {
        super.setupDebugLineVertices(verticesData, partialTicks, clientIn, serverIn);
        dpath: if (Core.debugPathRender && serverIn != null) {
            const serverEntity = serverIn.entities.getByUUID(this.uuid);
            if (serverEntity instanceof EntityEnemy == false)
                break dpath;
            const lastMovedIndexes = serverEntity.lastMovedIndexes;
            const pathfindResult = serverEntity.pathfindResult;
            const positions = [];
            const indices = [];
            const color = vec4.fromValues(1, 0, 0, 1); // Red color for path
            for (let i = 0; i < pathfindResult.length - 1; i++) {
                const currentNode = pathfindResult[i];
                const nextNode = pathfindResult[i + 1];
                positions.push(currentNode.x, 0, currentNode.y);
                positions.push(nextNode.x, 0, nextNode.y);
                const offset = positions.length / 3 - 2;
                indices.push(offset, offset + 1);
            }
            const offset = verticesData.position.length / 3;
            verticesData.position.push(...positions);
            verticesData.indices.push(...indices.map(index => index + offset));
            for (let i = 0; i < positions.length / 3; i++) {
                verticesData.textureColor.push(...color);
            }
            // console.log(lastMovedIndexes)
        }
    }
}
EntityEnemy.ENEMY_SPAWN_RANGE = 10;
const SHOOT_ANIM_TICK = 10;
class EntityEnemyOctopus extends EntityEnemy {
    constructor(gameIn) {
        super(gameIn);
        this.shootAnimTick = 0;
        this.shootCooldown = 0;
        this.shootEvent = this.syncManager.register(new EntityEventSyncProperty(Side.SERVER, EntityEnemyOctopus.SHOOT_EVENT_ID, data => this.shootAnimTick = SHOOT_ANIM_TICK, this));
    }
    tick(gameIn) {
        var _d;
        super.tick(gameIn);
        if (!((_d = this.target) === null || _d === void 0 ? void 0 : _d.isAlive()))
            this.target = null;
        if (gameIn instanceof Server && this.isAlive()) {
            if (this.shootCooldown <= 0 && this.target != null && this.getDistanceByEntity(this.target) < EntityEnemyOctopus.CAN_SHOOT_DISTANCE) {
                this.shoot(gameIn);
            }
            this.shootCooldown--;
        }
        this.shootAnimTick--;
    }
    shoot(gameIn) {
        this.shootCooldown = 25;
        if (gameIn instanceof Server) {
            const entity = new EntityType.OCTOPUS_PROJECTILE(gameIn, this); // "this" is parent
            entity.spawn(gameIn);
            this.shootEvent.trigger(0);
            // this.sendEventPacket(gameIn, EntityEventTypes.OCTOPUS_SHOOT, 0)
        }
    }
    recieveEventPacket(gameIn, id, data) {
        super.recieveEventPacket(gameIn, id, data);
        if (id == EntityEventTypes.OCTOPUS_SHOOT) {
            this.shootAnimTick = SHOOT_ANIM_TICK;
        }
    }
    pathfindToEntity(target) {
        const keepDistForPlayer = 3;
        const distForPlayer = vec3.sub(vec3.create(), target.pos, this.pos);
        const normal = vec3Util.tomul(vec3.normalize(vec3.create(), distForPlayer), -keepDistForPlayer);
        const tracedPos = this.trace(target.pos, normal);
        return this.pathfindTo(Math.round(tracedPos[0]), Math.round(tracedPos[2]));
    }
    getRenderCubes(partialTicks) {
        let shootAnimTick = SHOOT_ANIM_TICK - this.shootAnimTick;
        if (shootAnimTick >= 0)
            shootAnimTick + partialTicks;
        if (shootAnimTick >= SHOOT_ANIM_TICK)
            shootAnimTick = 0;
        const d = Math.sin(shootAnimTick / SHOOT_ANIM_TICK * Math.PI * 2) / 4;
        return [
            new Cube(-8, 0, -8, 8, 16, 8).setTexture(64, 64, 0, 0).toScaled(1 + d, 1 - d, 1 + d),
            new Cube(-2, 6, 8, 2, 10, 16).setTexture(64, 64, 0, 32).toScaled(1 + d, 1 - d, 1 + d)
        ];
    }
    getRenderTexture(partialTicks) {
        return [textures.get("octopus")];
    }
}
EntityEnemyOctopus.CAN_SHOOT_DISTANCE = 10;
class EntityEnemyOctopusProjectile extends Entity {
    constructor(gameIn, owner) {
        super(gameIn);
        this.size = vec2.fromValues(0.2, 0.2);
        this.powerLevel = this.syncManager.register(new EntityDataSyncProperty(Side.SERVER, EntityEnemy.POWER_LEVEL_ID, 1, this));
        // 引数があるのはサーバー側だけ
        if (owner != null) {
            this.setPos(owner.pos[0], owner.pos[1], owner.pos[2]);
            this.rotation.set(owner.rotation.get());
            this.powerLevel.set(owner.powerLevel.get());
            this.owner = owner;
        }
    }
    tick(gameIn) {
        super.tick(gameIn);
        const speed = 0.5;
        const radian = MathUtil.toRadian(this.rotation.get());
        const moveX = Math.sin(radian) * speed;
        const moveY = 0;
        const moveZ = Math.cos(radian) * speed;
        this.addVelocity(moveX, moveY, moveZ);
        if (gameIn instanceof Server && this.bb != null) {
            const hurtResult = gameIn.entities.getCollideWith(this.bb).getOnlyClass(EntityPlayer).hurtAll(this.getAttackDamage(), this, gameIn);
            if (hurtResult) {
                this.discardForHit(gameIn);
            }
            if (this.wasCollision.x || this.wasCollision.y || this.wasCollision.z) {
                this.discardForHit(gameIn);
            }
        }
    }
    discardForHit(serverIn) {
        serverIn.spawnProjectileHitEffectEvent.trigger(this.pos, 0);
        super.discard(serverIn);
    }
    getAttackDamage() {
        return this.powerLevel.get() * 0.2 + 1;
    }
    getRenderCubes() {
        return [
            new Cube(-4, 0, -4, 4, 8, 4).setTexture(64, 64, 32, 32),
        ];
    }
    getRenderTexture() {
        return [textures.get("octopus")];
    }
    canDespawn() {
        return true;
    }
}
//#region Particle
class Particle {
    constructor(pos) {
        this.wasCollision = new wasCollisionContext(false, false, false);
        this.bb = null;
        this.oldPos = vec3.fromValues(NaN, NaN, NaN);
        this.velocity = vec3.fromValues(0, 0, 0);
        this.ticksExisted = 0;
        this.lifeTime = 20;
        this.pos = pos;
    }
    setupVertices(verticesData, partialTicks, cam) {
        verticesData.position.push(...[0, 0, 0]);
        verticesData.position.push(...[10, 0, 0]);
        verticesData.position.push(...[10, 10, 0]);
        verticesData.position.push(...[0, 10, 0]);
        verticesData.textureCoord.push(...[0, 0]);
        verticesData.textureCoord.push(...[1, 0]);
        verticesData.textureCoord.push(...[1, 1]);
        verticesData.textureCoord.push(...[0, 1]);
        verticesData.textureColor.push(0, 0, 0, 0);
        verticesData.textureColor.push(0, 0, 0, 0);
        verticesData.textureColor.push(0, 0, 0, 0);
        verticesData.textureColor.push(0, 0, 0, 0);
        let offset = 0;
        verticesData.indices.push(...[0, 1, 2, 0, 2, 3].map(value => value + offset * 4));
    }
    spawn(clientIn) {
        var _d;
        if (clientIn.particles.includes(this))
            console.warn("particles ", this, " was double spawned");
        (_d = this.uuid) !== null && _d !== void 0 ? _d : (this.uuid = crypto.randomUUID());
        clientIn.particles.push(this);
        // this.client = clientIn;
        return this;
    }
    discard(clientIn) {
        clientIn.particles.removeByInstance(this);
        return true;
    }
    tick(clientIn) {
        this.oldPos[0] = this.pos[0];
        this.oldPos[1] = this.pos[1];
        this.oldPos[2] = this.pos[2];
        this.travel(clientIn);
        this.frictionTick();
        this.move(this.velocity[0], this.velocity[1], this.velocity[2]);
        this.ticksExisted++;
        if (this.ticksExisted >= this.lifeTime)
            this.discard(clientIn);
    }
    travel(clientIn) {
    }
    frictionTick() {
        const friction = this.getFriction();
        this.velocity[0] *= friction;
        this.velocity[1] *= this.getAirResistance();
        this.velocity[2] *= friction;
    }
    getAirResistance() {
        return 0.6;
    }
    getFriction() {
        return 0.6;
    }
    move(xa, ya, za) {
        if (this.bb == null) {
            this.pos = vec3Util.toadd(this.pos, xa, ya, za);
            this.wasCollision = new wasCollisionContext(false, false, false);
            return;
        }
        if (Math.abs(xa) < 0)
            xa = 0;
        if (Math.abs(ya) < 0)
            ya = 0;
        if (Math.abs(za) < 0)
            za = 0;
        let ogXa = xa;
        let ogYa = ya;
        let ogZa = za;
        let aabbs = this.getCollides();
        for (let aabb of aabbs) {
            xa = aabb.clipXCollide(this.bb, xa);
        }
        this.bb.move(xa, 0, 0);
        for (let aabb of aabbs) {
            ya = aabb.clipYCollide(this.bb, ya);
        }
        this.bb.move(0, ya, 0);
        for (let aabb of aabbs) {
            za = aabb.clipZCollide(this.bb, za);
        }
        this.bb.move(0, 0, za);
        this.wasCollision = new wasCollisionContext(ogXa !== xa, ogYa !== ya, ogZa !== za);
    }
    getCollides() {
        return LevelUtil.getCubes(vec2.fromValues(this.pos[0], this.pos[2]), 2, true);
    }
}
Particle.textureImageSize = vec2.fromValues(64, 64);
class ParticleBillboard extends Particle {
    constructor() {
        super(...arguments);
        this.textureLeftTop = vec2.fromValues(0, 0);
        this.textureSize = vec2.fromValues(8, 8);
        this.textureColor = Color.TRANSPARENT;
        this.textureAlpha = 1;
    }
    setupVertices(verticesData, partialTicks, cam) {
        const spriteCenterPos = this.getSpriteCenterPos(partialTicks);
        const spriteSize = this.getSpriteSize(partialTicks);
        const textureLeftTop = this.getTextureLeftTop(partialTicks);
        const textureSize = this.getTextureSize(partialTicks);
        const textureColor = this.getTextureColor(partialTicks);
        const textureAlpha = this.getTextureAlpha(partialTicks);
        const texImgSize = Particle.textureImageSize;
        this.addBillboardToVertices(spriteCenterPos, spriteSize, vec2Util.tomul(textureLeftTop, 1 / texImgSize[0], 1 / texImgSize[1]), vec2Util.tomul(textureSize, 1 / texImgSize[0], 1 / texImgSize[1]), partialTicks, cam, verticesData, textureColor, textureAlpha);
    }
    addBillboardToVertices(centerPos, size, textureLeftTop, textureSize, partialTicks, cam, verticesData, color = Color.TRANSPARENT, alpha = 1) {
        Renderer.addBillboardToVertices(centerPos, size, textureLeftTop, textureSize, partialTicks, [new RotationPointContext(-cam.dir[0], cam.dir[1], 0, centerPos)], verticesData);
        verticesData.textureColor.push(...color); // 左上
        verticesData.textureColor.push(...color); // 右上
        verticesData.textureColor.push(...color); // 右下
        verticesData.textureColor.push(...color); // 左下
        verticesData.textureVarious.push(alpha); // 左上
        verticesData.textureVarious.push(alpha); // 右上
        verticesData.textureVarious.push(alpha); // 右下
        verticesData.textureVarious.push(alpha); // 左下
    }
    addRotatedFace(positions, points, rotatePoints) {
        points.forEach(point => {
            const rotatedPoint = Renderer.rotateVertexWithMultipleRotatePoints(point, rotatePoints);
            positions.push(rotatedPoint[0], rotatedPoint[1], rotatedPoint[2]);
        });
    }
    ;
    getTextureLeftTop(partialTicks) {
        return this.textureLeftTop;
    }
    getTextureSize(partialTicks) {
        return this.textureSize;
    }
    getSpriteCenterPos(partialTicks) {
        const x = MathUtil.lerp(partialTicks, this.oldPos[0], this.pos[0]);
        const y = MathUtil.lerp(partialTicks, this.oldPos[1], this.pos[1]);
        const z = MathUtil.lerp(partialTicks, this.oldPos[2], this.pos[2]);
        return vec3.fromValues(x, y, z);
    }
    getSpriteSize(partialTicks) {
        return vec2Util.todiv(this.textureSize, 16);
    }
    getTextureColor(partialTicks) {
        return this.textureColor;
    }
    getTextureAlpha(partialTicks) {
        return this.textureAlpha;
    }
}
class ParticleAnimationBase extends ParticleBillboard {
    constructor(pos) {
        super(pos);
        this.lifeTime = this.getTickPerFrame() * this.getFrameAmount();
    }
    getFrameOffset() { return 0; }
    ;
    getFrameSize() { return 8; }
    ;
    getFrameAmount() { return 8; }
    ;
    getTickPerFrame() { return 2; }
    ;
    getTextureLeftTop(partialTicks) {
        const leftFramePos = Math.floor(this.ticksExisted / this.getTickPerFrame() + this.getFrameOffset()) * this.getFrameSize();
        return vec2Util.toadd(this.textureLeftTop, leftFramePos, 0);
    }
}
class ParticleSmokeBase extends ParticleAnimationBase {
    constructor(pos) {
        super(pos);
    }
    getFrameOffset() {
        return 0;
    }
    getFrameAmount() {
        return 8;
    }
    getTickPerFrame() {
        return 2;
    }
}
class ParticleSmokeSmallBase extends ParticleAnimationBase {
    constructor(pos) {
        super(pos);
    }
    getFrameOffset() {
        return 4;
    }
    getFrameAmount() {
        return 4;
    }
    getTickPerFrame() {
        return 2;
    }
}
class ParticleDeathSmoke extends ParticleSmokeBase {
    constructor(pos, size) {
        super(pos);
        this.velocity = vec3.random(vec3.create(), size / 3);
    }
    travel(clientIn) {
        this.velocity[1] += 0.05;
    }
}
class ParticleDeathSmokeSmall extends ParticleSmokeSmallBase {
    constructor(pos, size) {
        super(pos);
        this.velocity = vec3.random(vec3.create(), size / 3);
    }
    travel(clientIn) {
        this.velocity[1] += 0.05;
    }
    getSpriteSize(partialTicks) {
        return vec2.fromValues(0.5, 0.5);
    }
}
class ParticleProjectileHit extends ParticleSmokeSmallBase {
    constructor(pos, size) {
        super(pos);
        const color = 0.25;
        this.textureColor = vec4.fromValues(color, color, color, 1);
    }
}
class ParticleSprintFire extends ParticleBillboard {
    constructor(pos, velocity) {
        super(pos);
        this.frameAbount = 8;
        this.tickPerFrame = 2;
        this.velocity = velocity;
        this.lifeTime = 5;
        this.textureLeftTop = vec2.fromValues(0, 8);
    }
    getSpriteSize(partialTicks) {
        let scale = (this.ticksExisted + partialTicks) * -0.2 + 1;
        scale = Math.max(0, scale);
        return vec2.fromValues(scale, scale);
    }
}
class ParticleSprintSmoke extends ParticleSmokeSmallBase {
    constructor(pos) {
        super(pos);
        this.velocity = vec3.random(vec3.create(), 1);
        this.lifeTime = 5;
        this.textureColor = vec4.fromValues(Math.random(), 0, 0, 1);
    }
    getSpriteSize(partialTicks) {
        let scale = (this.ticksExisted + partialTicks) * -0.2 + 1;
        scale = Math.max(0, scale);
        return vec2.fromValues(scale, scale);
    }
}
class ParticleXpShadow extends ParticleBillboard {
    constructor(pos) {
        super(pos);
        this.textureLeftTop = vec2.fromValues(8, 8);
        this.lifeTime = 10;
    }
    getSpriteSize(partialTicks) {
        const size = this.getEasedSize(partialTicks) / 2;
        return vec2.fromValues(size, size);
    }
    getTextureAlpha(partialTicks) {
        return this.getEasedSize(partialTicks);
    }
    getSize(partialTicks) {
        const totalTicks = this.ticksExisted + partialTicks;
        return totalTicks / this.lifeTime;
    }
    getEasedSize(partialTicks) {
        return 1 - Easing.easeOutExpo(this.getSize(partialTicks));
    }
}
class Registry extends Map {
    getKey(searchValue) {
        var _d, _e;
        return (_e = (_d = Array.from(this.entries()).find(([key, value]) => value === searchValue)) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : null;
    }
    set(key, value) {
        let a = super.set(key, value);
        ;
        this.createMapGetter(key);
        return a;
    }
    createMapGetter(key) {
        Object.defineProperty(this, key, {
            get: function () {
                return this.get(key);
            }
        });
    }
    createReadonly(key, value) {
        Object.defineProperty(this, key, {
            get: function () {
                return value;
            }
        });
    }
}
class EntityRegistryData {
    constructor(key, baseClass) {
        this.key = key;
        this.baseClass = baseClass;
    }
    create(gameIn, ...arg) {
        let createdClass = new this.baseClass(gameIn, ...arg);
        if (this.baseClass.getParentKey)
            this.createReadonly.call(createdClass, "registryData", this);
        return createdClass;
    }
    createReadonly(key, value) {
        Object.defineProperty(this, key, {
            get: function () {
                return value;
            }
        });
    }
}
class RegistryEntityType extends ReverseRegistry {
    getByInstance(entity) {
        const entityClass = entity.constructor;
        return this.getByValue(entityClass);
    }
}
class EntityType {
    static hasId(entityTypeId) {
        return this.registry.hasKey(entityTypeId);
    }
    static getById(entityTypeId) {
        return this.registry.getByKey(entityTypeId);
    }
    static getByInstance(entity) {
        return this.registry.getByInstance(entity);
    }
}
_a = EntityType;
EntityType.registry = new RegistryEntityType;
EntityType.OCTOPUS = _a.registry.register(0x00, EntityEnemyOctopus);
EntityType.OCTOPUS_PROJECTILE = _a.registry.register(0x01, EntityEnemyOctopusProjectile);
EntityType.XP = _a.registry.register(0x10, EntityXp);
class LevelUtil {
    static isOnWall(pos, rot) {
        const seed = SeededRandom.generateSeed(pos[0], pos[1]);
        const rng = new SeededRandom(seed);
        return this.roomWallTypes2[Math.abs(Math.floor(rng.random() * 40)) % 3][rot.getHorizontalIndex()] == 1;
    }
    static getCubes(centerPos, range, isHitbox) {
        const cubes = new Array;
        for (const pos of this.getCircle(range, vec2.fromValues(Math.round(centerPos[0] / this.roomWidth), Math.round(centerPos[1] / this.roomWidth)))) {
            cubes.push(...this.getCube(pos, isHitbox));
        }
        return cubes;
    }
    static getCachedOrCreateCubes(pos, isHitbox) {
        const cacheMap = isHitbox ? this.levelCacheHitbox : this.levelCacheCube;
        const key = pos.toString();
        let levelCube = cacheMap.get(key);
        if (levelCube != null) {
            return levelCube;
        }
        levelCube = this.getCube(pos, isHitbox);
        cacheMap.set(key, levelCube);
        return levelCube;
    }
    static getCube(pos, isHitbox) {
        const cubes = new Array;
        for (const terrainCube of isHitbox ? this.roomFloorHitbox.main : this.roomFloorCubes.main) {
            cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
        }
        for (const levelCube of this.getWallCube(pos, isHitbox)) {
            cubes.push(levelCube);
        }
        return cubes;
    }
    static getWallCube(pos, isHitbox) {
        const cubes = new Array;
        for (const terrainCube of isHitbox ? this.roomPillarHitbox.main : this.roomPillarCubes.main) {
            cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
        }
        // if (this.shouldAddPollar(pos)) {
        // for (const terrainCube of isHitbox ? this.roomPillar2Hitbox.main : this.roomPillar2Cubes.main) {
        // cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
        // }
        // }
        if (this.shouldAddWallSide(pos, Facing.NORTH)) {
            for (const terrainCube of isHitbox ? this.roomWallNorthHitbox.main : this.roomWallNorthCubes.main) {
                cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
            }
        }
        if (this.shouldAddWallSide(pos, Facing.SOUTH)) {
            for (const terrainCube of isHitbox ? this.roomWallSouthHitbox.main : this.roomWallSouthCubes.main) {
                cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
            }
        }
        if (this.shouldAddWallSide(pos, Facing.EAST)) {
            for (const terrainCube of isHitbox ? this.roomWallEastHitbox.main : this.roomWallEastCubes.main) {
                cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
            }
        }
        if (this.shouldAddWallSide(pos, Facing.WEST)) {
            for (const terrainCube of isHitbox ? this.roomWallWestHitbox.main : this.roomWallWestCubes.main) {
                cubes.push(terrainCube.toMoved(pos[0] * this.roomWidth, 0, pos[1] * this.roomWidth));
            }
        }
        return cubes;
    }
    static shouldAddWallSide(pos, facing) {
        // return pos[0] == 0 && (facing == Facing.SOUTH || facing == Facing.NORTH);
        const oppesite = facing.getOppesite();
        return this.isOnWall(pos, facing) && this.isOnWall(oppesite.getHorizontalMoved(pos), oppesite);
    }
    static shouldAddPollar(pos) {
        if (this.shouldAddWallSide(vec2Util.toadd(pos, -1, -1), Facing.NORTH))
            return true;
        if (this.shouldAddWallSide(vec2Util.toadd(pos, 0, -1), Facing.WEST))
            return true;
        if (this.shouldAddWallSide(vec2Util.toadd(pos, 0, 0), Facing.SOUTH))
            return true;
        if (this.shouldAddWallSide(vec2Util.toadd(pos, -1, 0), Facing.EAST))
            return true;
        return false;
    }
    static getCircle(range, offset = vec2.fromValues(0, 0)) {
        const dots = new Array;
        for (let x = -range; x < range; x++) {
            const yMax = Math.ceil(Math.sqrt(Math.pow(range, 2) - Math.pow(x, 2)));
            for (let y = -yMax + 1; y < yMax; y++) {
                dots.push(vec2.fromValues(x + offset[0], y + offset[1]));
            }
        }
        return dots;
    }
}
LevelUtil.roomFloorCubes = {
    main: [
        new CubeTile(-5, -0.5, -5, 5, 0, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneFloor, 0b001000)),
    ]
};
LevelUtil.roomFloorHitbox = {
    main: [
        new AABB(-5, -0.5, -5, 5, 0, 5),
    ]
};
LevelUtil.roomPillarCubes = {
    main: [
        new CubeTile(-5, -0.5, -5, -3, 5, -3, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b101010)),
        new CubeTile(3, -0.5, -5, 5, 5, -3, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b101001)),
        new CubeTile(-5, -0.5, 3, -3, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b011010)),
        new CubeTile(3, -0.5, 3, 5, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b011001)),
    ]
};
LevelUtil.roomPillarHitbox = {
    main: [
        new AABB(-5, -0.5, -5, -3, 5, -3),
        new AABB(3, -0.5, -5, 5, 5, -3),
        new AABB(-5, -0.5, 3, -3, 5, 5),
        new AABB(3, -0.5, 3, 5, 5, 5),
    ]
};
LevelUtil.roomPillar2Cubes = {
    main: [
        new CubeTile(-7, -0.5, -7, -3, 5, -3, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b111011)),
    ]
};
LevelUtil.roomPillar2Hitbox = {
    main: [
        new AABB(-7, -0.5, -7, -3, 5, -3),
    ]
};
LevelUtil.roomPillarNorthWestCubes = {
    main: [
        new CubeTile(-5, -0.5, -5, -3, 5, -3, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b101010)),
    ]
};
LevelUtil.roomPillarNorthWestHitbox = {
    main: [
        new AABB(-5, -0.5, -5, -3, 5, -3),
    ]
};
LevelUtil.roomPillarNorthEastCubes = {
    main: [
        new CubeTile(3, -0.5, -5, 5, 5, -3, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b101001)),
    ]
};
LevelUtil.roomPillarNorthEastHitbox = {
    main: [
        new AABB(3, -0.5, -5, 5, 5, -3),
    ]
};
LevelUtil.roomPillarSouthWestCubes = {
    main: [
        new CubeTile(-5, -0.5, 3, -3, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b011010)),
    ]
};
LevelUtil.roomPillarSouthWestHitbox = {
    main: [
        new AABB(-5, -0.5, 3, -3, 5, 5),
    ]
};
LevelUtil.roomPillarSouthEastCubes = {
    main: [
        new CubeTile(3, -0.5, 3, 5, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b011001)),
    ]
};
LevelUtil.roomPillarSouthEastHitbox = {
    main: [
        new AABB(3, -0.5, 3, 5, 5, 5),
    ]
};
LevelUtil.roomWallNorthCubes = {
    main: [
        new CubeTile(-5, -0.5, -5, 5, 5, -4, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b101000)),
    ]
};
LevelUtil.roomWallNorthHitbox = {
    main: [
        new AABB(-5, -0.5, -5, 5, 5, -4),
    ]
};
LevelUtil.roomWallSouthCubes = {
    main: [
        new CubeTile(-5, -0.5, 4, 5, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b011000)),
    ]
};
LevelUtil.roomWallSouthHitbox = {
    main: [
        new AABB(-5, -0.5, 4, 5, 5, 5),
    ]
};
LevelUtil.roomWallEastCubes = {
    main: [
        new CubeTile(-5, -0.5, -5, -4, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b001010)),
    ]
};
LevelUtil.roomWallEastHitbox = {
    main: [
        new AABB(-5, -0.5, -5, -4, 5, 5),
    ]
};
LevelUtil.roomWallWestCubes = {
    main: [
        new CubeTile(4, -0.5, -5, 5, 5, 5, ...CubeTile.getFilteredTextures(CubeTile.textureStoneWall, 0b001001)),
    ]
};
LevelUtil.roomWallWestHitbox = {
    main: [
        new AABB(4, -0.5, -5, 5, 5, 5),
    ]
};
LevelUtil.roomWallTypes1 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];
LevelUtil.roomWallTypes2 = [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
];
LevelUtil.roomWallTypes3 = [
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 0]
];
LevelUtil.roomWidth = 10;
LevelUtil.levelCacheCube = new Map;
LevelUtil.levelCacheHitbox = new Map;
class SaveType {
}
class SaveTypeIndexedDB extends SaveType {
    init() {
        const request = indexedDB.open("GameDB", 1);
        request.onupgradeneeded = event => {
            let db = event.target.result;
            db.createObjectStore("saves", { keyPath: "name" });
        };
    }
    save(name, json) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const dbRequest = indexedDB.open("GameDB", 1);
                dbRequest.onsuccess = function (event) {
                    let db = event.target.result;
                    let transaction = db.transaction("saves", "readwrite");
                    let store = transaction.objectStore("saves");
                    store.put({ name, json });
                    dbRequest.onsuccess = () => resolve();
                    dbRequest.onerror = () => reject(dbRequest.error);
                };
            });
        });
    }
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const dbRequest = indexedDB.open("GameDB", 1);
                dbRequest.onsuccess = function (event) {
                    let db = event.target.result;
                    let transaction = db.transaction("saves", "readonly");
                    let store = transaction.objectStore("saves");
                    let getData = store.get(name);
                    getData.onsuccess = () => { var _d; return resolve(((_d = getData.result) === null || _d === void 0 ? void 0 : _d.json) || null); };
                    getData.onerror = () => reject(getData.error);
                };
                dbRequest.onerror = () => reject(dbRequest.error);
            });
        });
    }
    loadIfAbsent(name, defaultObj) {
        return __awaiter(this, void 0, void 0, function* () {
            let loadeddata = yield this.load(name);
            if (SaveHandler.isSuccessLoad(loadeddata))
                return loadeddata;
            return defaultObj;
        });
    }
}
class IllegalArgmentExeption extends Error {
}
class SaveDataIllegalArgmentExeption extends Error {
}
class SaveHandler {
    constructor(serverIn) {
        this.serverIn = serverIn;
        this.saveType = new SaveTypeIndexedDB;
    }
    saveEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = [];
            for (const entity of this.serverIn.entities) {
                if (entity instanceof EntityPlayer)
                    continue;
                const data = {};
                entity.save(data);
                entities.push(data);
            }
            const jsonObj = { entities, version: SaveHandler.VERSION };
            this.saveType.save(SaveHandler.ENTITY_ID, jsonObj);
            return jsonObj;
        });
    }
    saveAllPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadeddata = yield this.saveType.loadIfAbsent(SaveHandler.PLAYER_ID, {});
            const players = loadeddata;
            for (const entity of this.serverIn.entities.getPlayers()) {
                const data = {};
                entity.save(data);
                players[entity.uuid] = data;
            }
            const jsonObj = { players, version: SaveHandler.VERSION };
            this.saveType.save(SaveHandler.PLAYER_ID, jsonObj);
            return jsonObj;
        });
    }
    loadAndSpawnEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            const loadedData = yield this.saveType.load(SaveHandler.ENTITY_ID);
            if (!SaveHandler.isSuccessLoad(loadedData))
                return;
            let { entities, version } = loadedData;
            if (!Array.isArray(entities))
                throw new SaveDataIllegalArgmentExeption();
            for (const data of entities) {
                if (!TypeUtil.isNonNullObject(data))
                    throw new SaveDataIllegalArgmentExeption();
                if (!TypeUtil.isNumber(version))
                    version = SaveHandler.VERSION;
                const entityClass = Entity.getEntityByData(data);
                if (entityClass == null)
                    continue;
                const entity = new entityClass(this.serverIn);
                entity.load(data, version);
                entity.spawn(this.serverIn);
            }
        });
    }
    loadAndInitPlayer(player, { players, version }) {
        const data = players[player.uuid];
        player.load(data, version);
    }
    static isSuccessLoad(data) {
        return !(data instanceof DOMException) && data != null;
    }
}
SaveHandler.VERSION = 0;
SaveHandler.ENTITY_ID = "entities";
SaveHandler.PLAYER_ID = "players";
// #region Render
class ProgramInfo {
    constructor(gl, shaderProgram, attribLocations, uniformLocations) {
        this.program = shaderProgram;
        this.attribLocations = objMap(attribLocations, (_key, name) => this.getAttribLocation(gl, shaderProgram, name));
        this.uniformLocations = objMap(uniformLocations, (_key, name) => this.getUniformLocation(gl, shaderProgram, name));
    }
    getAttribLocation(gl, program, name) {
        const location = gl.getAttribLocation(program, name);
        if (location == -1)
            throw new Error("Attribute location not found: " + name);
        return location;
    }
    getUniformLocation(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        if (location == null)
            throw new Error("Uniform location not found: " + name);
        return location;
    }
}
class GLBuffers {
    constructor(position, textureCoord, indices, textureVarious, textureColor) {
        this.vertexCount = -1;
        this.position = position;
        this.textureCoord = textureCoord;
        this.indices = indices;
        this.textureVarious = textureVarious;
        this.textureColor = textureColor;
    }
}
class GLBufferArray {
    constructor() {
        this.position = [];
        this.textureCoord = [];
        this.indices = [];
        this.textureVarious = [];
        this.textureColor = [];
    }
}
class Renderer {
    static canvasInit(canvas) {
        const gl = canvas.getContext("webgl");
        if (gl == null) {
            throw new Error("WebGL context not available");
        }
        this.buffersTerrain = RegacyRenderer.initBuffers(gl);
        this.buffersParticle = ParticleRenderer.initBuffers(gl);
        this.buffersDebug = DebugRenderer.initBuffers(gl);
        this.buffersPlayer = RegacyRenderer.initBuffers(gl);
        this.buffersTitleBg = RegacyRenderer.initBuffers(gl);
        this.buffersUi = GuiRenderer.initBuffers(gl);
        this.buffersUiDebug = GuiDebugRenderer.initBuffers(gl);
        this.programInfo = RegacyRenderer.getProgramInfo(gl);
        this.programInfoDebug = DebugRenderer.getProgramInfo(gl);
        this.programInfoPtc = ParticleRenderer.getProgramInfo(gl);
        this.programInfoUiDebug = GuiDebugRenderer.getProgramInfo(gl);
        this.programInfoUi = GuiRenderer.getProgramInfo(gl);
        textures.setFallBackTexture(this.loadTexture(gl, "textures/fallback.png", vec4.fromValues(0, 255, 255, 255)));
        this.textureStone = this.registerTexture(textures, "stone", gl, "textures/terrain/stone.png", [127, 127, 127, 127]);
        this.textureStoneWall = this.registerTexture(textures, "stone_wall", gl, "textures/terrain/stone_wall.png", [127, 127, 127, 127]);
        this.texturePlayer = this.registerTexture(textures, "player", gl, "textures/player.png");
        this.textureParticles = this.registerTexture(textures, "partiicles", gl, "textures/particles.png");
        this.textureOctopus = this.registerTexture(textures, "octopus", gl, "textures/entities/octopus.png");
        this.textureXp = this.registerTexture(textures, "xp", gl, "textures/entities/xp.png");
        this.textureTitleBg = this.registerTexture(textures, "title", gl, "terrain.png");
        this.textureText = this.registerTexture(textures, "text", gl, "textures/text/text.png");
        this.TextureGui = this.registerTexture(textures, "gui", gl, "textures/gui.png");
        this.TextureSolid = this.registerTexture(textures, "gui", gl, "textures/gui.png");
        this.textureNewText = this.registerTexture(textures, "new_text", gl, "textures/text/uni_00.png");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        return gl;
    }
    static drawGui(gl, gui, partialTicks) {
        if (gl == null)
            return;
        GuiRenderer.initBuffersUpdate(gl, Renderer.buffersUi, gui, partialTicks);
        GuiRenderer.drawUi(gl, Renderer.programInfoUi, Renderer.buffersUi, [Renderer.TextureGui, Renderer.textureNewText]);
        if (!Core.debugGuiRect)
            return;
        GuiDebugRenderer.initBuffersUpdate(gl, Renderer.buffersUiDebug, gui, partialTicks);
        GuiDebugRenderer.drawUi(gl, Renderer.programInfoUiDebug, Renderer.buffersUiDebug);
    }
    static renderInGame(client) {
        var _d, _e;
        const gl = client.gl;
        const partialTicks = client.partialTicks;
        this.updateFov(client, partialTicks);
        RegacyRenderer.initBuffersUpdate(gl, Renderer.buffersTerrain, LevelUtil.getCubes(vec3Util.getXY(client.entityPlayer.pos), 5, false));
        RegacyRenderer.drawScene(gl, Renderer.programInfo, Renderer.buffersTerrain, [Renderer.textureStone, Renderer.textureStoneWall], vec3.fromValues(0, 0, 0), { cam: client.cam, partialTicks, enableFaceCulling: true });
        ParticleRenderer.initBuffersUpdate(gl, Renderer.buffersParticle, client.particles, partialTicks, client.cam);
        ParticleRenderer.drawParticle(gl, Renderer.programInfoPtc, Renderer.buffersParticle, Renderer.textureParticles, partialTicks, client.cam);
        if (Core.debugLinesRender) {
            DebugRenderer.initBuffersUpdate(gl, Renderer.buffersDebug, client.entities, partialTicks, client, client.isOffline ? client.integratedServer : null);
            DebugRenderer.drawEntity(gl, Renderer.programInfoDebug, Renderer.buffersDebug, partialTicks, client.cam);
        }
        for (const entity of client.entities.filter((e) => e.ticksAlived > 1)) {
            EntityRenderer.initBuffersUpdate(gl, Renderer.buffersPlayer, entity, partialTicks, client.cam);
            const renderPos = (_d = entity.getRenderPos(partialTicks)) !== null && _d !== void 0 ? _d : vec3.fromValues(0, 0, 0);
            EntityRenderer.drawEntity(gl, Renderer.programInfo, Renderer.buffersPlayer, entity.getRenderTexture(partialTicks), renderPos, entity.getRenderRotation(partialTicks), vec3.fromValues(Entity.BASE_SCALE, Entity.BASE_SCALE, Entity.BASE_SCALE), partialTicks, client.cam, entity.getRenderOverlayColor(partialTicks), entity.getGrovalAlpha(partialTicks));
            const text = entity.getScreenText();
            if (text != null) {
                RegacyRenderer.initBuffersUpdate(gl, Renderer.buffersPlayer, RegacyRenderer.scalingCubes(RegacyRenderer.getEntityTextCube((_e = entity.getScreenText()) !== null && _e !== void 0 ? _e : ""), entity.getScale()));
                RegacyRenderer.drawScene(gl, Renderer.programInfo, Renderer.buffersPlayer, [Renderer.textureText], vec3.fromValues(renderPos[0], renderPos[1], renderPos[2]), { cam: client.cam, entityIn: entity, partialTicks, enableAlpha: true }, vec3.fromValues(0, client.cam.dir[1], 0));
            }
        }
        Renderer.drawGui(gl, client.guiHud, partialTicks);
        // this.copyToUiCanvas(ctx, gl);
        // this.drawUi(ctx, { cam: client.cam, client, tps: clientTick.parSec, fps: clientFlame.parSec, partialTicks });
    }
    static renderTitle(client) {
        const gl = client.gl;
        const partialTicks = client.partialTicks;
        RegacyRenderer.initBuffersUpdate(gl, Renderer.buffersTerrain, LevelUtil.getCubes(vec2.fromValues(0, 0), 5, false));
        RegacyRenderer.drawScene(gl, Renderer.programInfo, Renderer.buffersTerrain, [Renderer.textureStone, Renderer.textureStoneWall], vec3.fromValues(0, 0, 0), { cam: client.camTitle, partialTicks });
    }
    static renderConnect(client) {
        const gl = client.gl;
        RegacyRenderer.initBuffersUpdate(gl, Renderer.buffersTitleBg, this.cubesTitleBg);
        const partialTicks = client.partialTicks;
        RegacyRenderer.drawScene(gl, Renderer.programInfo, Renderer.buffersTitleBg, [Renderer.textureTitleBg], vec3.fromValues(0, 0, 0), { cam: client.camTitle, partialTicks });
    }
    static updateFrame(clientIn) {
        const gl = clientIn.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const partialTicks = clientIn.updatePartialTick();
    }
    static registerTexture(registry, identifier, gl, url, defaultColor) {
        const texture = this.loadTexture(gl, url, defaultColor);
        registry.set(identifier, texture);
        return texture;
    }
    static loadTexture(gl, url, defaultColor = vec4.fromValues(0, 0, 0, 256)) {
        const texture = gl.createTexture();
        if (texture == null)
            throw Error("failed create texture");
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array(defaultColor);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            function isPowerOf2(value) {
                return (value & (value - 1)) === 0;
            }
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            //texture.repeat.set(3, 3);
        };
        image.src = url;
        return texture;
    }
    static textTexture(gl, text) {
        const textCanvas = document.createElement('canvas');
        const textContext = textCanvas.getContext('2d');
        if (textContext == null)
            return null;
        textContext.font = '48px sans-serif';
        textContext.fillText('Hello, WebGL!', 10, 50);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    static initShaderProgram(gl, vsSource, fsSource, debugHint) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource, debugHint + " vertex");
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource, debugHint + " fragment");
        // Create the shader program
        const shaderProgram = gl.createProgram();
        if (shaderProgram == null)
            return null;
        if (vertexShader == null)
            return null;
        if (fragmentShader == null)
            return null;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.warn(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        return shaderProgram;
    }
    static loadShader(gl, type, source, debugHint) {
        const shader = gl.createShader(type);
        if (shader == null)
            return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("error at " + debugHint);
            console.warn(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    static initCommonBuffer(gl) {
        const positionBuffer = gl.createBuffer();
        if (positionBuffer == null)
            return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 12 * 10, gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static initIndexBuffer(gl) {
        const indexBuffer = gl.createBuffer();
        if (indexBuffer == null)
            return -1;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 6 * 10, gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static commonBufferUpdateByArray(gl, positionBuffer, posVertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posVertices), gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static indexBufferUpdateByArray(gl, indexBuffer, indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static enableMultiTexture(gl, programInfo, textures, samplerPrefix = "sampler") {
        for (const indexStr in textures) {
            const index = +indexStr;
            gl.activeTexture(gl.TEXTURE0 + index);
            gl.bindTexture(gl.TEXTURE_2D, textures[index]);
            const location = programInfo.uniformLocations[samplerPrefix + index];
            if (location == null)
                throw Error("Bug detected! " + `programInfo.uniformLocations.${samplerPrefix + index} is null`);
            gl.uniform1i(location, index);
        }
    }
    static setPositionAttribute(gl, buffers, programInfo) {
        if (buffers.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (programInfo.attribLocations.vertexPosition == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.vertexPosition is null");
        this.setAttribute(gl, 3, buffers.position, programInfo.attribLocations.vertexPosition);
    }
    static setTextureAttribute(gl, buffers, programInfo) {
        if (buffers.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (programInfo.attribLocations.textureCoord == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureCoord is null");
        this.setAttribute(gl, 2, buffers.textureCoord, programInfo.attribLocations.textureCoord);
    }
    static setTextureVariousAttribute(gl, buffers, programInfo) {
        if (buffers.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (programInfo.attribLocations.textureVarious == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureVarious is null");
        this.setAttribute(gl, 2, buffers.textureVarious, programInfo.attribLocations.textureVarious);
    }
    static setTextureColorAttribute(gl, buffers, programInfo) {
        if (buffers.textureColor == null)
            throw Error("Bug detected! " + "buffers.textureColor is null");
        if (programInfo.attribLocations.textureColor == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureColor is null");
        this.setAttribute(gl, 4, buffers.textureColor, programInfo.attribLocations.textureColor);
    }
    static setAttribute(gl, numComponents, buffer, attribLocations) {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribLocations, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(attribLocations);
    }
    static copyToUiCanvas(ctx, gl) {
        ctx.drawImage(gl.canvas, 0, 0);
    }
    static updateFov(client, partialTicks) {
        const player = client.entityPlayer;
        let attackTime = player.attackTime;
        if (player.isAttacking)
            attackTime += partialTicks;
        if (attackTime >= 5)
            attackTime = 0;
        const attackFov = Math.sin(attackTime / 5 * Math.PI) * 5;
        const speedFov = MathUtil.lerp(partialTicks, player.oldMovedDis, player.movedDis) * 10;
        this.fov = client.fov + attackFov + speedFov;
    }
    static rotationMatrix(pitchDeg, yawDeg, rollDeg) {
        const pitchRad = MathUtil.toRadian(pitchDeg);
        const yawRad = MathUtil.toRadian(yawDeg);
        const rollRad = MathUtil.toRadian(rollDeg);
        const matrix = mat4.create();
        mat4.rotate(matrix, matrix, rollRad, [0, 0, 1]);
        mat4.rotate(matrix, matrix, yawRad, [0, 1, 0]);
        mat4.rotate(matrix, matrix, pitchRad, [1, 0, 0]);
        return matrix;
    }
    static rotatePoint(point, matrix) {
        const result = vec3.create();
        vec3.transformMat4(result, point, matrix);
        return result;
    }
    static rotateVertexWithMultipleRotatePoints(vertex, rotations) {
        let rotatedVertex = vertex;
        for (const { pitch, yaw, roll, rotateCenter } of rotations) {
            const rotationMat = Renderer.rotationMatrix(pitch, yaw, roll);
            rotatedVertex = Renderer.rotatePointAroundCenter(rotatedVertex, rotationMat, rotateCenter);
        }
        return rotatedVertex;
    }
    static rotateVerticesWithMultipleRotatePoints(vertices, rotations) {
        const rotatedVerices = [];
        for (const vertex of vertices) {
            let rotatedVertex = vertex;
            for (const { pitch, yaw, roll, rotateCenter } of rotations) {
                const rotationMat = Renderer.rotationMatrix(pitch, yaw, roll);
                rotatedVertex = Renderer.rotatePointAroundCenter(rotatedVertex, rotationMat, rotateCenter);
            }
            rotatedVerices.push(rotatedVertex);
        }
        return rotatedVerices;
    }
    static rotatePointAroundCenter(point, matrix, center) {
        const translatedPoint = vec3.sub(vec3.create(), point, center);
        const rotatedPoint = Renderer.rotatePoint(translatedPoint, matrix);
        return vec3.add(vec3.create(), rotatedPoint, center);
    }
    static addBillboardToVertices(centerPos, size, textureLeftTop, textureSize, partialTicks, rotatePoints, verticesData) {
        // ここにそのコードを追加して
        // 勉強するから後は任せた！！
        // おっけ
        const halfSize = vec2.fromValues(size[0] / 2, size[1] / 2);
        let vertexToAdd = [];
        let offset = verticesData.indices[verticesData.indices.length - 1];
        offset = offset == null ? 0 : offset + 1;
        vertexToAdd.push(vec3.fromValues(-halfSize[0] + centerPos[0], +halfSize[1] + centerPos[1], centerPos[2])); // 左上
        vertexToAdd.push(vec3.fromValues(+halfSize[0] + centerPos[0], +halfSize[1] + centerPos[1], centerPos[2])); // 右上
        vertexToAdd.push(vec3.fromValues(+halfSize[0] + centerPos[0], -halfSize[1] + centerPos[1], centerPos[2])); // 右下
        vertexToAdd.push(vec3.fromValues(-halfSize[0] + centerPos[0], -halfSize[1] + centerPos[1], centerPos[2])); // 左下
        this.addRotatedFace(verticesData.position, vertexToAdd, rotatePoints);
        verticesData.textureCoord.push(...[textureLeftTop[0], -textureLeftTop[1]]); // 左上
        verticesData.textureCoord.push(...[textureLeftTop[0] + textureSize[0], -textureLeftTop[1]]); // 右上
        verticesData.textureCoord.push(...[textureLeftTop[0] + textureSize[0], -textureLeftTop[1] - textureSize[1]]); // 右下
        verticesData.textureCoord.push(...[textureLeftTop[0], -textureLeftTop[1] - textureSize[1]]); // 左下
        verticesData.indices.push(...[0, 1, 2, 0, 2, 3].map(value => value + offset));
    }
    static addRotatedFace(positions, points, rotatePoints) {
        points.forEach(point => {
            const rotatedPoint = Renderer.rotateVertexWithMultipleRotatePoints(point, rotatePoints);
            positions.push(rotatedPoint[0], rotatedPoint[1], rotatedPoint[2]);
        });
    }
    ;
}
Renderer.guiRender = (client) => {
    const gl = client.gl;
    const partialTicks = client.partialTicks;
    if (client.currentGui != null) {
        Renderer.drawGui(gl, client.currentGui, partialTicks);
    }
    if (Core.debugtext) {
        Renderer.drawGui(gl, client.guiDebug, partialTicks);
    }
};
Renderer.cubesTitleBg = [
    new Cube(-0.5, -0.5, -0.5, 0.5, 0.5, 0.5).setTexture(64, 64, 0, 0)
];
Renderer.fov = 60;
class RegacyRenderer {
    static drawScene(gl, programInfo, buffers, textures, cubePosition, { cam, entityIn, partialTicks, overlayColor: color = vec4.fromValues(1, 1, 1, 0), grovalAlpha = 1, enableAlpha = false, enableFaceCulling = true }, rotation = vec3.fromValues(0, 0, 0)) {
        var _d, _e, _f;
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling && enableFaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        if (enableAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        else {
            gl.disable(gl.BLEND);
        }
        const fieldOfView = (Renderer.fov * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();
        const camDir = cam.getRenderDir(partialTicks);
        const camPos = cam.getRenderPos(partialTicks);
        var yaw = MathUtil.toRadian(camDir[1]);
        var pitch = MathUtil.toRadian(camDir[0]);
        var roll = MathUtil.toRadian(camDir[2]);
        var direction = {
            x: Math.cos(pitch) * Math.sin(yaw),
            y: Math.sin(pitch),
            z: Math.cos(pitch) * Math.cos(yaw)
        };
        var cameraVertexPosition = vec3.fromValues(camPos[0], camPos[1], camPos[2]);
        var lookAtPoint = vec3.fromValues(direction.x, direction.y, direction.z);
        var upDirection = vec3.fromValues(0, 1, 0);
        mat4.lookAt(modelViewMatrix, vec3.create(), lookAtPoint, upDirection);
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.subtract(vec3.create(), cubePosition, cameraVertexPosition));
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_d = rotation[0]) !== null && _d !== void 0 ? _d : 0), [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_e = rotation[1]) !== null && _e !== void 0 ? _e : 0), [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_f = rotation[2]) !== null && _f !== void 0 ? _f : 0), [0, 0, 1]);
        Renderer.setPositionAttribute(gl, buffers, programInfo);
        Renderer.setTextureAttribute(gl, buffers, programInfo);
        Renderer.setTextureVariousAttribute(gl, buffers, programInfo);
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.useProgram(programInfo.program);
        if (programInfo.uniformLocations.projectionMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.projectionMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        if (programInfo.uniformLocations.modelViewMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.modelViewMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        Renderer.enableMultiTexture(gl, programInfo, textures, "sampler");
        if (programInfo.uniformLocations.grovalAlpha == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.grovalAlpha is null");
        gl.uniform1f(programInfo.uniformLocations.grovalAlpha, grovalAlpha);
        if (programInfo.uniformLocations.overlayColor == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.overlayColor is null");
        gl.uniform4f(programInfo.uniformLocations.overlayColor, color[0], color[1], color[2], color[3]);
        {
            const vertexCount = buffers.vertexCount;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
        if ((entityIn === null || entityIn === void 0 ? void 0 : entityIn.setScreenPos) != null) {
            const screenPos = this.worldToScreen(gl, 0, 0, 0, modelViewMatrix, projectionMatrix);
            entityIn.setScreenPos(screenPos[0], screenPos[1]);
        }
    }
    static initBuffers(gl) {
        const positionBuffer = this.initCommonBuffer(gl);
        const textureCoordBuffer = this.initTextureBuffer(gl);
        const textureVariousBuffer = this.initTextureVariousBuffer(gl);
        const indexBuffer = this.initIndexBuffer(gl);
        return new GLBuffers(positionBuffer, textureCoordBuffer, indexBuffer, textureVariousBuffer);
    }
    static initBuffersUpdate(gl, buffer, cubes) {
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (buffer.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        this.initPositionBufferUpdate(gl, buffer.position, cubes);
        this.initTextureBufferUpdate(gl, buffer.textureCoord, cubes);
        this.initTextureVariousBufferUpdate(gl, buffer.textureVarious, cubes);
        this.initIndexBufferUpdate(gl, buffer.indices, cubes);
        buffer.vertexCount = this.tempVertexCount;
    }
    static initCommonBuffer(gl) {
        const positionBuffer = gl.createBuffer();
        if (positionBuffer == null)
            return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 12 * 10, gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static initPositionBufferUpdate(gl, positionBuffer, cubes) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [];
        for (const cube of cubes) {
            // const rotationMats = cube.rotatePoints.map(rotate => Renderer.rotationMatrix(rotate.pitch, rotate.yaw, rotate.roll));
            let { x0: x0, y0: y0, z0: z0, x1: x1, y1: y1, z1: z1 } = cube;
            const addRotatedFace = (positions, points) => {
                points.forEach(point => {
                    const rotatedPoint = Renderer.rotateVertexWithMultipleRotatePoints(point, cube.rotatePoints);
                    positions.push(rotatedPoint[0], rotatedPoint[1], rotatedPoint[2]);
                });
            };
            const textures = cube.getTextures();
            for (const index in textures) {
                if (textures[index] == -1)
                    continue;
                switch (+index) {
                    case 0:
                        // 前面
                        addRotatedFace(positions, [
                            vec3.fromValues(x0, y0, z1),
                            vec3.fromValues(x1, y0, z1),
                            vec3.fromValues(x1, y1, z1),
                            vec3.fromValues(x0, y1, z1),
                        ]);
                        break;
                    case 1:
                        // 背面
                        addRotatedFace(positions, [
                            vec3.fromValues(x0, y0, z0),
                            vec3.fromValues(x0, y1, z0),
                            vec3.fromValues(x1, y1, z0),
                            vec3.fromValues(x1, y0, z0),
                        ]);
                        break;
                    case 2:
                        // 上面
                        addRotatedFace(positions, [
                            vec3.fromValues(x0, y1, z0),
                            vec3.fromValues(x0, y1, z1),
                            vec3.fromValues(x1, y1, z1),
                            vec3.fromValues(x1, y1, z0),
                        ]);
                        break;
                    case 3:
                        // 底面
                        addRotatedFace(positions, [
                            vec3.fromValues(x0, y0, z0),
                            vec3.fromValues(x1, y0, z0),
                            vec3.fromValues(x1, y0, z1),
                            vec3.fromValues(x0, y0, z1),
                        ]);
                        break;
                    case 4:
                        // 右側面
                        addRotatedFace(positions, [
                            vec3.fromValues(x1, y0, z0),
                            vec3.fromValues(x1, y1, z0),
                            vec3.fromValues(x1, y1, z1),
                            vec3.fromValues(x1, y0, z1),
                        ]);
                        break;
                    case 5:
                        // 左側面
                        addRotatedFace(positions, [
                            vec3.fromValues(x0, y0, z0),
                            vec3.fromValues(x0, y0, z1),
                            vec3.fromValues(x0, y1, z1),
                            vec3.fromValues(x0, y1, z0),
                        ]);
                }
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static initIndexBuffer(gl) {
        const indexBuffer = gl.createBuffer();
        if (indexBuffer == null)
            return -1;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 6 * 10, gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static initIndexBufferUpdate(gl, indexBuffer, cubes) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = new Array;
        let offset = 0;
        for (const cube of cubes) {
            const textures = cube.getTextures();
            for (const texture of textures) {
                if (texture == -1)
                    continue;
                indices.push(...[0, 1, 2, 0, 2, 3].map(value => value + offset * 4));
                offset++;
            }
        }
        this.tempVertexCount = indices.length;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static initTextureBuffer(gl) {
        const textureCoordBuffer = gl.createBuffer();
        if (textureCoordBuffer == null)
            return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 8 * 10, gl.DYNAMIC_DRAW);
        return textureCoordBuffer;
    }
    static initTextureBufferUpdate(gl, textureCoordBuffer, cubes) {
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [];
        const textureSize = 1;
        for (const cube of cubes) {
            if (cube.texture == null)
                continue;
            const defUV = new TextureUV(0, 0, 1, 1);
            const { x0: x0, y0: y0, z0: z0, x1: x1, y1: y1, z1: z1 } = cube;
            const { front: front, back: back, top: top, bottom: bottom, right: right, left: left } = cube.texture;
            const isRepeatTexture = cube instanceof CubeTile;
            let xs = 1;
            let ys = 1;
            let zs = 1;
            if (isRepeatTexture) {
                xs = x1 - x0;
                ys = y1 - y0;
                zs = z1 - z0;
            }
            const textures = cube.getTextures();
            for (const index in textures) {
                if (textures[index] == -1)
                    continue;
                switch (+index) {
                    case 0:
                        // 前面
                        const uv0 = front == null || isRepeatTexture ? defUV : front.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv0.x0, -uv0.y1 * ys, uv0.x1 * xs, -uv0.y1 * ys, uv0.x1 * xs, -uv0.y0, uv0.x0, -uv0.y0);
                        break;
                    case 1:
                        // 背面
                        const uv1 = back == null || isRepeatTexture ? defUV : back.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv1.x1 * xs, -uv1.y1 * ys, uv1.x1 * xs, -uv1.y0, uv1.x0, -uv1.y0, uv1.x0, -uv1.y1 * ys);
                        break;
                    case 2:
                        // 上面
                        const uv2 = top == null || isRepeatTexture ? defUV : top.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv2.x1 * xs, -uv2.y1 * zs, uv2.x1 * xs, -uv2.y0, uv2.x0, -uv2.y0, uv2.x0, -uv2.y1 * zs);
                        break;
                    case 3:
                        // 下面
                        const uv3 = bottom == null || isRepeatTexture ? defUV : bottom.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv3.x0, -uv3.y1 * zs, uv3.x1 * xs, -uv3.y1 * zs, uv3.x1 * xs, -uv3.y0, uv3.x0, -uv3.y0);
                        break;
                    case 4:
                        // 右面
                        const uv4 = right == null || isRepeatTexture ? defUV : right.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv4.x1 * zs, -uv4.y1 * ys, uv4.x1 * zs, -uv4.y0, uv4.x0, -uv4.y0, uv4.x0, -uv4.y1 * ys);
                        break;
                    case 5:
                        // 左面
                        const uv5 = left == null || isRepeatTexture ? defUV : left.getUV0to1(cube.texture.width, cube.texture.height);
                        textureCoordinates.push(uv5.x0, -uv5.y1 * ys, uv5.x1 * zs, -uv5.y1 * ys, uv5.x1 * zs, -uv5.y0, uv5.x0, -uv5.y0);
                        break;
                }
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.DYNAMIC_DRAW);
        return textureCoordBuffer;
    }
    static initTextureVariousBuffer(gl) {
        const textureVariousBuffer = gl.createBuffer();
        if (textureVariousBuffer == null)
            return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, textureVariousBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 10 * 10, gl.DYNAMIC_DRAW);
        return textureVariousBuffer;
    }
    static initTextureVariousBufferUpdate(gl, textureVariousBuffer, cubes) {
        gl.bindBuffer(gl.ARRAY_BUFFER, textureVariousBuffer);
        const textureVarious = [];
        const textureSize = 1;
        for (const cube of cubes) {
            let { textureFront: t0, textureBack: t1, textureTop: t2, textureBottom: t3, textureRight: t4, textureLeft: t5 } = cube;
            const textures = cube.getTextures();
            for (const index in textures) {
                if (textures[index] == -1)
                    continue;
                switch (+index) {
                    case 0:
                        // 前面
                        textureVarious.push(t0, 0, t0, 0, t0, 0, t0, 0);
                        break;
                    case 1:
                        // 背面
                        textureVarious.push(t1, 0, t1, 0, t1, 0, t1, 0);
                        break;
                    case 2:
                        // 上面
                        textureVarious.push(t2, 0, t2, 0, t2, 0, t2, 0);
                        break;
                    case 3:
                        // 下面
                        textureVarious.push(t3, 0, t3, 0, t3, 0, t3, 0);
                        break;
                    case 4:
                        // 右面
                        textureVarious.push(t4, 0, t4, 0, t4, 0, t4, 0);
                        break;
                    case 5:
                        // 左面
                        textureVarious.push(t5, 0, t5, 0, t5, 0, t5, 0);
                        break;
                }
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureVarious), gl.DYNAMIC_DRAW);
        return textureVariousBuffer;
    }
    static worldToScreen(gl, x, y, z, modelViewMatrix, projectionMatrix) {
        // 3D空間座標
        const worldCoordinates = vec4.fromValues(x, y, z, 1.0); // w=1.0 for homogeneous coordinates
        // クリッピング座標系へ変換
        const clipCoordinates = vec4.create();
        vec4.transformMat4(clipCoordinates, worldCoordinates, modelViewMatrix);
        vec4.transformMat4(clipCoordinates, clipCoordinates, projectionMatrix);
        // 正規デバイス座標系へ変換
        const ndcCoordinates = [
            clipCoordinates[0] / clipCoordinates[3],
            clipCoordinates[1] / clipCoordinates[3],
            clipCoordinates[2] / clipCoordinates[3]
        ];
        // スクリーン座標系へ変換
        const canvasWidth = gl.canvas.width;
        const canvasHeight = gl.canvas.height;
        const screenCoordinates = vec2.fromValues((ndcCoordinates[0] + 1) / 2 * canvasWidth, (1 - ndcCoordinates[1]) / 2 * canvasHeight // Y軸は逆
        );
        return screenCoordinates;
        // thanks to chatgpt
    }
    static getEntityTextCube(text) {
        if (text == null)
            return [];
        const cubes = new Array;
        // text = text.toString();
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const cube = new Cube(-2, 0, -2, 2, 0, 2).toMoved(i * -4 + text.length * 2, 20, 0);
            const texturePos = this.regacyTextTexturePos[char];
            const texture = new TextureUV(texturePos * 16, 0, texturePos * 16 + 16, 16);
            const textureBlank = new TextureUV(0, 0, 0, 0);
            cube.texture = new Texture(256, 256, textureBlank, textureBlank, texture, textureBlank, textureBlank);
            cubes.push(cube);
        }
        return cubes;
    }
    static scalingCubes(cubes, scale) {
        const scaledCubes = new Array;
        for (const cube of cubes) {
            scaledCubes.push(cube.toScaled(scale[0], scale[1], scale[2]).toScaled(1 / 16, 1 / 16, 1 / 16));
        }
        return scaledCubes;
    }
    static getProgramInfo(gl) {
        const vsSource = `
			attribute vec4 aVertexPosition;
			attribute vec2 aTextureCoord;
			attribute vec2 aTextureVarious;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying lowp vec2 vTextureCoord;
			varying lowp vec2 vTextureVarious;

			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vTextureCoord = aTextureCoord;
				vTextureVarious = aTextureVarious;
			}
			`;
        const fsSource = `
			varying lowp vec2 vTextureCoord;
			varying lowp vec2 vTextureVarious;

			uniform sampler2D uSampler0;
			uniform sampler2D uSampler1;
			uniform lowp vec4 uOverlayColor;
			uniform lowp float uGrovalAlpha;


			lowp vec4 overlay(lowp vec4 base, lowp vec4 blend) {
   				lowp vec4 overlayColor =  mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base));
				 return mix(base, overlayColor, blend.a);
			}		
			
			lowp vec4 overlay2(lowp vec4 base, lowp vec4 blend) {
				 return mix(base, blend, blend.a * base.r * base.g * base.b  );
			}


			void main(void) {
				lowp vec4 tempcolor= vec4(1,1,1,1);

				if (vTextureVarious.s == 0.0) {
					tempcolor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));;
				} else if (vTextureVarious.s == 1.0) {
					tempcolor = texture2D(uSampler1, vec2(vTextureCoord.s, vTextureCoord.t));;
				}
				tempcolor *= uGrovalAlpha;

				lowp vec4 mixedColor = overlay2(tempcolor,uOverlayColor);
				if (mixedColor.a < 0.0) {
					discard;
				}
				gl_FragColor=mixedColor;

			}
			`;
        const shaderProgram = Renderer.initShaderProgram(gl, vsSource, fsSource, "common");
        if (shaderProgram == null)
            throw new Error("Shader program not found");
        const attribLocations = {
            vertexPosition: "aVertexPosition",
            textureCoord: "aTextureCoord",
            textureVarious: "aTextureVarious",
        };
        const uniformLocations = {
            projectionMatrix: "uProjectionMatrix",
            modelViewMatrix: "uModelViewMatrix",
            sampler0: "uSampler0",
            sampler1: "uSampler1",
            overlayColor: "uOverlayColor",
            grovalAlpha: "uGrovalAlpha",
        };
        const programInfo = new ProgramInfo(gl, shaderProgram, attribLocations, uniformLocations);
        return programInfo;
    }
}
RegacyRenderer.tempVertexCount = 0;
RegacyRenderer.regacyTextTexturePos = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    l: 10,
    v: 11,
};
class ParticleRenderer {
    static drawParticle(gl, programInfo, buffers, texture, partialTicks, cam) {
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        const fieldOfView = (Renderer.fov * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();
        const camDir = cam.getRenderDir(partialTicks);
        const camPos = cam.getRenderPos(partialTicks);
        var yaw = MathUtil.toRadian(camDir[1]);
        var pitch = MathUtil.toRadian(camDir[0]);
        var roll = MathUtil.toRadian(camDir[2]);
        var direction = [
            Math.cos(pitch) * Math.sin(yaw),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        ];
        var cameraVertexPosition = vec3.fromValues(camPos[0], camPos[1], camPos[2]);
        var lookAtPoint = vec3.fromValues(direction[0] + camPos[0], direction[1] + camPos[1], direction[2] + camPos[2]);
        var upDirection = vec3.fromValues(0, 1, 0);
        mat4.lookAt(modelViewMatrix, cameraVertexPosition, lookAtPoint, upDirection);
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        Renderer.setPositionAttribute(gl, buffers, programInfo);
        Renderer.setTextureAttribute(gl, buffers, programInfo);
        Renderer.setTextureColorAttribute(gl, buffers, programInfo);
        this.setTextureAlphaAttribute(gl, buffers, programInfo);
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.useProgram(programInfo.program);
        if (programInfo.uniformLocations.projectionMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.projectionMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        if (programInfo.uniformLocations.modelViewMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.modelViewMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (programInfo.uniformLocations.sampler0 == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.sampler0 is null");
        gl.uniform1i(programInfo.uniformLocations.sampler0, 0);
        {
            const vertexCount = buffers.vertexCount;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    static initBuffers(gl) {
        const positionBuffer = Renderer.initCommonBuffer(gl);
        const textureCoordBuffer = Renderer.initCommonBuffer(gl);
        const textureVariousBuffer = Renderer.initCommonBuffer(gl); // alpha buffer
        const textureColorBuffer = Renderer.initCommonBuffer(gl);
        const indexBuffer = Renderer.initIndexBuffer(gl);
        return new GLBuffers(positionBuffer, textureCoordBuffer, indexBuffer, textureVariousBuffer, textureColorBuffer);
    }
    static initBuffersUpdate(gl, buffer, particles, partialTicks, cam) {
        const verticesData = new GLBufferArray;
        for (const particle of particles) {
            particle.setupVertices(verticesData, partialTicks, cam);
        }
        // console.log(vertices)
        // console.log(texVertices)
        // console.log(indices)
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (buffer.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (buffer.textureColor == null)
            throw Error("Bug detected! " + "buffers.textureColor is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        Renderer.commonBufferUpdateByArray(gl, buffer.position, verticesData.position);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureCoord, verticesData.textureCoord);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureVarious, verticesData.textureVarious); // alpha buffer
        Renderer.commonBufferUpdateByArray(gl, buffer.textureColor, verticesData.textureColor);
        Renderer.indexBufferUpdateByArray(gl, buffer.indices, verticesData.indices);
        buffer.vertexCount = verticesData.indices.length;
    }
    static setTextureAlphaAttribute(gl, buffers, programInfo) {
        if (buffers.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null"); // alpha buffer
        if (programInfo.attribLocations.textureAlpha == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureAlpha is null");
        Renderer.setAttribute(gl, 1, buffers.textureVarious, programInfo.attribLocations.textureAlpha);
    }
    static getProgramInfo(gl) {
        const vsSourcePtc = `
			attribute vec4 aVertexPosition;
			attribute vec2 aTextureCoord;
			attribute vec4 aTextureColor;
			attribute float aTextureAlpha;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying lowp vec2 vTextureCoord;
			varying lowp vec4 vTextureColor;
			varying lowp float vTextureAlpha;

			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vTextureCoord = aTextureCoord;
				vTextureColor = aTextureColor;
				vTextureAlpha = aTextureAlpha;
			}
			`;
        const fsSourcePtc = `
			varying lowp vec2 vTextureCoord;
			varying lowp vec4 vTextureColor;
			varying lowp float vTextureAlpha;

			uniform sampler2D uSampler;

			lowp vec4 overlay2(lowp vec4 base, lowp vec4 blend) {
				 return mix(base, blend, blend.a * base.r * base.g * base.b  );
			}

			void main(void) {
				lowp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
				texelColor.a *= vTextureAlpha;

				lowp vec4 mixedColor = overlay2(texelColor, vTextureColor);
				if (mixedColor.a < 0.0) {
					discard;
				}
				gl_FragColor = mixedColor;
			}
			`;
        const shaderProgramPtc = Renderer.initShaderProgram(gl, vsSourcePtc, fsSourcePtc, "particle");
        if (shaderProgramPtc == null)
            throw new Error("Shader program not found");
        const attribLocationsPtc = {
            vertexPosition: "aVertexPosition",
            textureCoord: "aTextureCoord",
            textureColor: "aTextureColor",
            textureAlpha: "aTextureAlpha",
        };
        const uniformLocationsPtc = {
            projectionMatrix: "uProjectionMatrix",
            modelViewMatrix: "uModelViewMatrix",
            sampler0: "uSampler",
        };
        const programInfoPtc = new ProgramInfo(gl, shaderProgramPtc, attribLocationsPtc, uniformLocationsPtc);
        return programInfoPtc;
    }
}
class DebugRenderer {
    static drawEntity(gl, programInfo, buffers, partialTicks, cam) {
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        const fieldOfView = (Renderer.fov * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();
        const camDir = cam.getRenderDir(partialTicks);
        const camPos = cam.getRenderPos(partialTicks);
        var yaw = MathUtil.toRadian(camDir[1]);
        var pitch = MathUtil.toRadian(camDir[0]);
        var roll = MathUtil.toRadian(camDir[2]);
        var direction = [
            Math.cos(pitch) * Math.sin(yaw),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        ];
        var cameraVertexPosition = vec3.fromValues(camPos[0], camPos[1], camPos[2]);
        var lookAtPoint = vec3.fromValues(direction[0] + camPos[0], direction[1] + camPos[1], direction[2] + camPos[2]);
        var upDirection = vec3.fromValues(0, 1, 0);
        mat4.lookAt(modelViewMatrix, cameraVertexPosition, lookAtPoint, upDirection);
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        Renderer.setPositionAttribute(gl, buffers, programInfo);
        Renderer.setTextureColorAttribute(gl, buffers, programInfo);
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.useProgram(programInfo.program);
        if (programInfo.uniformLocations.projectionMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.projectionMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        if (programInfo.uniformLocations.modelViewMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.modelViewMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        {
            const vertexCount = buffers.vertexCount;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.LINES, vertexCount, type, offset);
        }
    }
    static initBuffers(gl) {
        const positionBuffer = Renderer.initCommonBuffer(gl);
        const textureColorBuffer = Renderer.initCommonBuffer(gl);
        const indexBuffer = Renderer.initIndexBuffer(gl);
        return new GLBuffers(positionBuffer, undefined, indexBuffer, undefined, textureColorBuffer);
    }
    static initBuffersUpdate(gl, buffer, entities, partialTicks, clientIn, serverIn) {
        const verticesData = new GLBufferArray;
        for (const entity of entities) {
            entity.setupDebugLineVertices(verticesData, partialTicks, clientIn, serverIn);
        }
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureColor == null)
            throw Error("Bug detected! " + "buffers.textureColor is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        Renderer.commonBufferUpdateByArray(gl, buffer.position, verticesData.position);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureColor, verticesData.textureColor);
        Renderer.indexBufferUpdateByArray(gl, buffer.indices, verticesData.indices);
        buffer.vertexCount = verticesData.indices.length;
    }
    static getProgramInfo(gl) {
        const vsSourcePtc = `
			attribute vec4 aVertexPosition;
			attribute vec4 aTextureColor;

			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying lowp vec4 vTextureColor;

			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vTextureColor = aTextureColor;
			}
			`;
        const fsSourcePtc = `
			varying lowp vec4 vTextureColor;

			void main(void) {
				gl_FragColor = vTextureColor;
			}
			`;
        const shaderProgramPtc = Renderer.initShaderProgram(gl, vsSourcePtc, fsSourcePtc, "particle");
        if (shaderProgramPtc == null)
            throw new Error("Shader program not found");
        const attribLocationsPtc = {
            vertexPosition: "aVertexPosition",
            textureColor: "aTextureColor",
        };
        const uniformLocationsPtc = {
            projectionMatrix: "uProjectionMatrix",
            modelViewMatrix: "uModelViewMatrix",
        };
        const programInfoPtc = new ProgramInfo(gl, shaderProgramPtc, attribLocationsPtc, uniformLocationsPtc);
        return programInfoPtc;
    }
}
class EntityRenderer {
    static drawEntity(gl, programInfo, buffers, textures, position, rotation, scale, partialTicks, cam, overlayColor, grovalAlpha) {
        var _d, _e, _f;
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        const fieldOfView = (Renderer.fov * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();
        const camDir = cam.getRenderDir(partialTicks);
        const camPos = cam.getRenderPos(partialTicks);
        var yaw = MathUtil.toRadian(camDir[1]);
        var pitch = MathUtil.toRadian(camDir[0]);
        var roll = MathUtil.toRadian(camDir[2]);
        var direction = [
            Math.cos(pitch) * Math.sin(yaw),
            Math.sin(pitch),
            Math.cos(pitch) * Math.cos(yaw)
        ];
        var cameraVertexPosition = vec3.fromValues(camPos[0], camPos[1], camPos[2]);
        var lookAtPoint = vec3.fromValues(direction[0] + camPos[0], direction[1] + camPos[1], direction[2] + camPos[2]);
        var upDirection = vec3.fromValues(0, 1, 0);
        mat4.lookAt(modelViewMatrix, cameraVertexPosition, lookAtPoint, upDirection);
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(position[0], position[1], position[2]));
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_d = rotation[0]) !== null && _d !== void 0 ? _d : 0), [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_e = rotation[1]) !== null && _e !== void 0 ? _e : 0), [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, MathUtil.toRadian((_f = rotation[2]) !== null && _f !== void 0 ? _f : 0), [0, 0, 1]);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scale[0], scale[1], scale[2]));
        Renderer.setPositionAttribute(gl, buffers, programInfo);
        Renderer.setTextureAttribute(gl, buffers, programInfo);
        Renderer.setTextureVariousAttribute(gl, buffers, programInfo);
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.useProgram(programInfo.program);
        if (programInfo.uniformLocations.projectionMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.projectionMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        if (programInfo.uniformLocations.modelViewMatrix == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.modelViewMatrix is null");
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        Renderer.enableMultiTexture(gl, programInfo, textures, "sampler");
        if (programInfo.uniformLocations.grovalAlpha == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.grovalAlpha is null");
        gl.uniform1f(programInfo.uniformLocations.grovalAlpha, grovalAlpha);
        if (programInfo.uniformLocations.overlayColor == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.overlayColor is null");
        gl.uniform4f(programInfo.uniformLocations.overlayColor, overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
        {
            const vertexCount = buffers.vertexCount;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    static initBuffers(gl) {
        const positionBuffer = Renderer.initCommonBuffer(gl);
        const textureCoordBuffer = Renderer.initCommonBuffer(gl);
        const textureVariousBuffer = Renderer.initCommonBuffer(gl);
        const indexBuffer = Renderer.initIndexBuffer(gl);
        return new GLBuffers(positionBuffer, textureCoordBuffer, indexBuffer, textureVariousBuffer);
    }
    static initBuffersUpdate(gl, buffer, entity, partialTicks, cam) {
        const verticesData = new GLBufferArray;
        entity.setupVertices(verticesData, partialTicks, cam);
        // console.log(vertices)
        // console.log(texVertices)
        // console.log(indices)
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (buffer.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        Renderer.commonBufferUpdateByArray(gl, buffer.position, verticesData.position);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureCoord, verticesData.textureCoord);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureVarious, verticesData.textureVarious);
        Renderer.indexBufferUpdateByArray(gl, buffer.indices, verticesData.indices);
        buffer.vertexCount = verticesData.indices.length;
    }
}
class GuiDebugRenderer {
    static drawUi(gl, programInfo, buffers) {
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(programInfo.program);
        GuiRenderer.setPositionAttribute(gl, buffers, programInfo);
        Renderer.setTextureColorAttribute(gl, buffers, programInfo);
        if (programInfo.uniformLocations.resolution == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.resolution is null");
        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        const vertexCount = buffers.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.LINES, vertexCount, type, offset);
    }
    static initBuffers(gl) {
        const positionBuffer = Renderer.initCommonBuffer(gl);
        const colorBuffer = Renderer.initCommonBuffer(gl);
        const indexBuffer = Renderer.initIndexBuffer(gl);
        return new GLBuffers(positionBuffer, undefined, indexBuffer, undefined, colorBuffer);
    }
    static initBuffersUpdate(gl, buffer, hud, partialTicks) {
        const verticesData = new GLBufferArray;
        hud.setupDebugVertices(verticesData, partialTicks, null);
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureColor == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        Renderer.commonBufferUpdateByArray(gl, buffer.position, verticesData.position);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureColor, verticesData.textureColor);
        Renderer.indexBufferUpdateByArray(gl, buffer.indices, verticesData.indices);
        buffer.vertexCount = verticesData.indices.length;
    }
    static getProgramInfo(gl) {
        const vsSourceUiDebug = `
			attribute vec2 aVertexPosition;
			attribute vec4 aTextureColor;

			uniform vec2 uResolution;

			varying lowp vec4 vTextureColor;
			void main() {
				vec2 zeroToOne = aVertexPosition / uResolution;
				vec2 zeroToTwo = zeroToOne * 2.0;
				vec2 clipSpace = zeroToTwo - 1.0;

				// Y座標を反転
				clipSpace[1] = -clipSpace[1];

				vTextureColor = aTextureColor;
				gl_Position = vec4(clipSpace,0, 1);
			}
			`;
        const fsSourceUiDebug = `
			varying lowp vec4 vTextureColor;
		
			void main() {
				gl_FragColor = vTextureColor;
			}
			`;
        const shaderProgramUiDebug = Renderer.initShaderProgram(gl, vsSourceUiDebug, fsSourceUiDebug, "uidebug");
        if (shaderProgramUiDebug == null)
            throw new Error("Shader program not found");
        const attribLocationsUiDebug = {
            vertexPosition: "aVertexPosition",
            textureColor: "aTextureColor",
        };
        const uniformLocationsUiDebug = {
            resolution: "uResolution",
        };
        const programInfoUiDebug = new ProgramInfo(gl, shaderProgramUiDebug, attribLocationsUiDebug, uniformLocationsUiDebug);
        return programInfoUiDebug;
    }
}
class GuiRenderer {
    static drawUi(gl, programInfo, buffers, textures) {
        gl.clearDepth(1.0);
        if (Core.debugfaceCulling)
            gl.enable(gl.CULL_FACE);
        else
            gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(programInfo.program);
        GuiRenderer.setPositionAttribute(gl, buffers, programInfo);
        GuiRenderer.setTextureAttribute(gl, buffers, programInfo);
        GuiRenderer.setTextureOneVariousAttribute(gl, buffers, programInfo);
        Renderer.setTextureColorAttribute(gl, buffers, programInfo);
        if (programInfo.uniformLocations.resolution == null)
            throw Error("Bug detected! " + "programInfo.uniformLocations.resolution is null");
        gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
        Renderer.enableMultiTexture(gl, programInfo, textures, "sampler");
        if (buffers.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        const vertexCount = buffers.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    static initBuffers(gl) {
        const positionBuffer = Renderer.initCommonBuffer(gl);
        const textureCoordBuffer = Renderer.initCommonBuffer(gl);
        const indexBuffer = Renderer.initIndexBuffer(gl);
        const textureVariousBuffer = Renderer.initCommonBuffer(gl);
        const textureColorBuffer = Renderer.initCommonBuffer(gl);
        return new GLBuffers(positionBuffer, textureCoordBuffer, indexBuffer, textureVariousBuffer, textureColorBuffer);
    }
    static initBuffersUpdate(gl, buffer, hud, partialTicks) {
        const verticesData = new GLBufferArray;
        hud.setupVertices(verticesData, partialTicks, null);
        if (buffer.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (buffer.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (buffer.indices == null)
            throw Error("Bug detected! " + "buffers.indices is null");
        if (buffer.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (buffer.textureColor == null)
            throw Error("Bug detected! " + "buffers.textureColor is null");
        Renderer.commonBufferUpdateByArray(gl, buffer.position, verticesData.position);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureCoord, verticesData.textureCoord);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureVarious, verticesData.textureVarious);
        Renderer.commonBufferUpdateByArray(gl, buffer.textureColor, verticesData.textureColor);
        Renderer.indexBufferUpdateByArray(gl, buffer.indices, verticesData.indices);
        buffer.vertexCount = verticesData.indices.length;
    }
    static initPositionBuffer(gl) {
        const positionBuffer = gl.createBuffer();
        if (positionBuffer == null)
            return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 12 * 10, gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static initPositionBufferUpdate(gl, positionBuffer, posVertices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posVertices), gl.DYNAMIC_DRAW);
        return positionBuffer;
    }
    static initIndexBuffer(gl) {
        const indexBuffer = gl.createBuffer();
        if (indexBuffer == null)
            return -1;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 6 * 10, gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static initIndexBufferUpdate(gl, indexBuffer, indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);
        return indexBuffer;
    }
    static setAttribute(gl, numComponents, buffer, attribLocations) {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        if (buffer == null)
            throw Error("Bug detected! " + "buffer is null");
        if (attribLocations == null)
            throw Error("Bug detected! " + "attribLocations is null");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribLocations, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(attribLocations);
    }
    static setPositionAttribute(gl, buffers, programInfo) {
        if (buffers.position == null)
            throw Error("Bug detected! " + "buffers.position is null");
        if (programInfo.attribLocations.vertexPosition == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.vertexPosition is null");
        this.setAttribute(gl, 2, buffers.position, programInfo.attribLocations.vertexPosition);
    }
    static setTextureAttribute(gl, buffers, programInfo) {
        if (buffers.textureCoord == null)
            throw Error("Bug detected! " + "buffers.textureCoord is null");
        if (programInfo.attribLocations.textureCoord == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureCoord is null");
        this.setAttribute(gl, 2, buffers.textureCoord, programInfo.attribLocations.textureCoord);
    }
    static setTextureOneVariousAttribute(gl, buffers, programInfo) {
        if (buffers.textureVarious == null)
            throw Error("Bug detected! " + "buffers.textureVarious is null");
        if (programInfo.attribLocations.textureVarious == null)
            throw Error("Bug detected! " + "programInfo.attribLocations.textureVarious is null");
        this.setAttribute(gl, 1, buffers.textureVarious, programInfo.attribLocations.textureVarious);
    }
    static getProgramInfo(gl) {
        const vsSourceUi = `
			attribute vec2 aVertexPosition;
			attribute vec2 aTextureCoord;
			attribute float aTextureVarious;
			attribute vec4 aTextureColor;

			uniform vec2 uResolution;

			varying lowp vec2 vTextureCoord;
			varying lowp float vTextureVarious;
			varying lowp vec4 vTextureColor;

			void main() {
				vec2 zeroToOne = aVertexPosition / uResolution;
				vec2 zeroToTwo = zeroToOne * 2.0;
				vec2 clipSpace = zeroToTwo - 1.0;

				// Y座標を反転
				clipSpace[1] = -clipSpace[1];
				
				vTextureCoord = aTextureCoord;
				vTextureVarious = aTextureVarious;
				vTextureColor = aTextureColor;
				gl_Position = vec4(clipSpace,0, 1);
			}
			`;
        const fsSourceUi = `
			varying lowp vec2 vTextureCoord;
			varying lowp float vTextureVarious;
			varying lowp vec4 vTextureColor;
			uniform sampler2D uSampler0;
			uniform sampler2D uSampler1;

			lowp vec4 overlay2(lowp vec4 base, lowp vec4 blend) {
				 return mix(base, blend, blend.a * base.r * base.g * base.b  );
			}
		
			void main() {
				lowp vec4 color = vec4(0);


				if (vTextureVarious == 0.0) {
					color = vTextureColor;
				} else if (vTextureVarious == 1.0) {
					color = texture2D(uSampler0, vec2(vTextureCoord[0], vTextureCoord[1]));
					color = overlay2(color,vTextureColor);
				} else if (vTextureVarious == 2.0) {
					lowp float colorAlpha = texture2D(uSampler1, vec2(vTextureCoord[0], vTextureCoord[1])).a;
					color = vec4(vTextureColor.rgb, colorAlpha * vTextureColor.a);
				}


				if (color.a < 0.0) {
					discard;
				}	
				gl_FragColor = color;
			}
			`;
        const shaderProgramUi = Renderer.initShaderProgram(gl, vsSourceUi, fsSourceUi, "ui");
        if (shaderProgramUi == null)
            throw new Error("Shader program not found");
        const attribLocationsUi = {
            vertexPosition: "aVertexPosition",
            textureCoord: "aTextureCoord",
            textureVarious: "aTextureVarious",
            textureColor: "aTextureColor"
        };
        const uniformLocationsUi = {
            resolution: "uResolution",
            sampler0: "uSampler0",
            sampler1: "uSampler1",
        };
        const programInfoUi = new ProgramInfo(gl, shaderProgramUi, attribLocationsUi, uniformLocationsUi);
        return programInfoUi;
    }
}
// #region UI Define
class GuiTextureDefine {
    constructor(various, imageSize) {
        this.various = various;
        this.imageSize = imageSize;
    }
}
class Gui {
    constructor() {
        this.guiUtil = new GuiUtil(this);
    }
    initGui(clientIn) {
        this.clientIn = clientIn;
    }
    setupVertices(verticesData, partialTicks, cam) {
    }
    setupDebugVertices(verticesData, partialTicks, cam) {
    }
    drawRectangleImageSize(leftTopPos, drawSize, textureLeftTop, textureSize, texture, textureColor = Color.WHITE, verticesData) {
        if (drawSize == null)
            drawSize = this.getDrawPos(textureSize);
        const textureImageSize = texture.imageSize;
        const fixedTextureLeftTop = vec2.fromValues(textureLeftTop[0] / textureImageSize[0], textureLeftTop[1] / textureImageSize[1]);
        const fixedTextureSize = vec2.fromValues(textureSize[0] / textureImageSize[0], textureSize[1] / textureImageSize[1]);
        this.drawRectangle(leftTopPos, drawSize, fixedTextureLeftTop, fixedTextureSize, textureColor, texture.various, verticesData);
    }
    drawRectangleSolid(leftTopPos, drawSize, textureColor, verticesData) {
        this.drawRectangle(leftTopPos, drawSize, vec2.fromValues(0, 0), vec2.fromValues(1, 1), textureColor, _b.TEXTURE_SOLID.various, verticesData);
    }
    drawRectangle(leftTopPosBase, drawSizeBase, textureLeftTop, textureSize, textureColor, textureVarious, verticesData) {
        const offset = verticesData.position.length / 2;
        const guiScale = this.getGuiScale();
        const leftTopPos = vec2Util.tomul(leftTopPosBase, guiScale);
        const drawSize = vec2Util.tomul(drawSizeBase, guiScale);
        verticesData.position.push(leftTopPos[0], leftTopPos[1] + drawSize[1]); // 左上
        verticesData.position.push(leftTopPos[0] + drawSize[0], leftTopPos[1] + drawSize[1]); // 右上
        verticesData.position.push(leftTopPos[0] + drawSize[0], leftTopPos[1]); // 右下
        verticesData.position.push(leftTopPos[0], leftTopPos[1]); // 左下
        verticesData.textureCoord.push(textureLeftTop[0], -textureLeftTop[1] - textureSize[1]); // 左上
        verticesData.textureCoord.push(textureLeftTop[0] + textureSize[0], -textureLeftTop[1] - textureSize[1]); // 右上
        verticesData.textureCoord.push(textureLeftTop[0] + textureSize[0], -textureLeftTop[1]); // 右下
        verticesData.textureCoord.push(textureLeftTop[0], -textureLeftTop[1]); // 左下
        verticesData.textureVarious.push(textureVarious); // 左上
        verticesData.textureVarious.push(textureVarious); // 右上
        verticesData.textureVarious.push(textureVarious); // 右下
        verticesData.textureVarious.push(textureVarious); // 左下
        verticesData.textureColor.push(...textureColor); // 左上
        verticesData.textureColor.push(...textureColor); // 右上
        verticesData.textureColor.push(...textureColor); // 右下
        verticesData.textureColor.push(...textureColor); // 左下
        verticesData.indices.push(...[0, 1, 2, 0, 2, 3].map(value => value + offset));
    }
    drawNineSlice(leftTopPos, drawSize, sprite, texture, textureColor = Color.WHITE, verticesData) {
        const nineSliceSize = sprite.nineSliceSize;
        const borderSize = sprite.nineSliceSize;
        const baseSize = sprite.baseSize;
        const texturePos = sprite.texturePos;
        /*
        const slices_old = [
            [texturePos[0], texturePos[1], nineSliceSize, nineSliceSize, leftTopPos[0] - borderSize, leftTopPos[1] - borderSize, borderSize, borderSize],
            [texturePos[0] + nineSliceSize, texturePos[1], baseSize[0], nineSliceSize, leftTopPos[0], leftTopPos[1] - borderSize, size[0], borderSize],
            [texturePos[0] + nineSliceSize + baseSize[0], texturePos[1], nineSliceSize, nineSliceSize, leftTopPos[0] + size[0], leftTopPos[1] - borderSize, borderSize, borderSize],
            [texturePos[0], texturePos[1] + nineSliceSize, nineSliceSize, baseSize[1], leftTopPos[0] - borderSize, leftTopPos[1], borderSize, size[1]],
            [texturePos[0] + nineSliceSize, texturePos[1] + nineSliceSize, baseSize[0], baseSize[1], leftTopPos[0], leftTopPos[1], size[0], size[1]],
            [texturePos[0] + nineSliceSize + baseSize[0], texturePos[1] + nineSliceSize, nineSliceSize, baseSize[1], leftTopPos[0] + size[0], leftTopPos[1], borderSize, size[1]],
            [texturePos[0], texturePos[1] + nineSliceSize + baseSize[1], nineSliceSize, nineSliceSize, leftTopPos[0] - borderSize, leftTopPos[1] + size[1], borderSize, borderSize],
            [texturePos[0] + nineSliceSize, texturePos[1] + nineSliceSize + baseSize[1], baseSize[0], nineSliceSize, leftTopPos[0], leftTopPos[1] + size[1], size[0], borderSize],
            [texturePos[0] + nineSliceSize + baseSize[0], texturePos[1] + nineSliceSize + baseSize[1], nineSliceSize, nineSliceSize, leftTopPos[0] + size[0], leftTopPos[1] + size[1], borderSize, borderSize],
        ]
        */
        const sliceTexXTop = texturePos[0];
        const sliceTexXMid = sliceTexXTop + nineSliceSize;
        const sliceTexXBtm = sliceTexXMid + baseSize[0];
        const sliceTexYLft = texturePos[1];
        const sliceTexYMid = sliceTexYLft + nineSliceSize;
        const sliceTexYRht = sliceTexYMid + baseSize[1];
        const sliceTexWSide = nineSliceSize;
        const sliceTexWCntr = baseSize[0];
        const sliceTexHSide = nineSliceSize;
        const sliceTexHCntr = baseSize[1];
        const sliceDrawXTop = leftTopPos[0] - borderSize;
        const sliceDrawXMid = sliceDrawXTop + borderSize;
        const sliceDrawXBtm = sliceDrawXMid + drawSize[0];
        const sliceDrawYLft = leftTopPos[1] - borderSize;
        const sliceDrawYMid = sliceDrawYLft + borderSize;
        const sliceDrawYRht = sliceDrawYMid + drawSize[1];
        const sliceDrawWSide = borderSize;
        const sliceDrawWCntr = drawSize[0];
        const sliceDrawHSide = borderSize;
        const sliceDrawHCntr = drawSize[1];
        const slices = [
            new TextureSizeAndDrawSize(sliceTexXTop, sliceTexYLft, sliceTexWSide, sliceTexHSide, sliceDrawXTop, sliceDrawYLft, sliceDrawWSide, sliceDrawHSide),
            new TextureSizeAndDrawSize(sliceTexXMid, sliceTexYLft, sliceTexWCntr, sliceTexHSide, sliceDrawXMid, sliceDrawYLft, sliceDrawWCntr, sliceDrawHSide),
            new TextureSizeAndDrawSize(sliceTexXBtm, sliceTexYLft, sliceTexWSide, sliceTexHSide, sliceDrawXBtm, sliceDrawYLft, sliceDrawWSide, sliceDrawHSide),
            new TextureSizeAndDrawSize(sliceTexXTop, sliceTexYMid, sliceTexWSide, sliceTexHCntr, sliceDrawXTop, sliceDrawYMid, sliceDrawWSide, sliceDrawHCntr),
            new TextureSizeAndDrawSize(sliceTexXMid, sliceTexYMid, sliceTexWCntr, sliceTexHCntr, sliceDrawXMid, sliceDrawYMid, sliceDrawWCntr, sliceDrawHCntr),
            new TextureSizeAndDrawSize(sliceTexXBtm, sliceTexYMid, sliceTexWSide, sliceTexHCntr, sliceDrawXBtm, sliceDrawYMid, sliceDrawWSide, sliceDrawHCntr),
            new TextureSizeAndDrawSize(sliceTexXTop, sliceTexYRht, sliceTexWSide, sliceTexHSide, sliceDrawXTop, sliceDrawYRht, sliceDrawWSide, sliceDrawHSide),
            new TextureSizeAndDrawSize(sliceTexXMid, sliceTexYRht, sliceTexWCntr, sliceTexHSide, sliceDrawXMid, sliceDrawYRht, sliceDrawWCntr, sliceDrawHSide),
            new TextureSizeAndDrawSize(sliceTexXBtm, sliceTexYRht, sliceTexWSide, sliceTexHSide, sliceDrawXBtm, sliceDrawYRht, sliceDrawWSide, sliceDrawHSide),
        ];
        for (const slice of slices) {
            this.drawRectangleImageSize(slice.drawPos, slice.drawSize, slice.texturePos, slice.textureSize, texture, textureColor, verticesData);
        }
    }
    getCharSize(char) {
        var _d;
        if (char.length > 1)
            throw Error("Bug detected! " + "char length is over 1");
        return (_d = _b.CHAR_SIZE.get(char)) !== null && _d !== void 0 ? _d : _b.CHAR_SIZE_DEFAULT;
    }
    getDrawTextSize(originFontSize, paddingPixel = vec2.fromValues(0, 0), text) {
        return vec2.fromValues(this.getDrawTextWidth(originFontSize, paddingPixel, text), this.getDrawTextHeight(originFontSize, paddingPixel));
    }
    getDrawTextWidth(originFontSize, paddingPixel = vec2.fromValues(0, 0), text) {
        let width = 0;
        for (const char of text) {
            width += originFontSize * (this.getCharSize(char) + paddingPixel[0]) * 1;
        }
        return width;
    }
    getDrawTextHeight(originFontSize, paddingPixel = vec2.fromValues(0, 0)) {
        return originFontSize * (_b.CHAR_SIZE_HEIGHT + paddingPixel[1]) * 1;
    }
    getCharYOffset(originFontSize, char) {
        var _d;
        const offsetPixel = (_d = _b.CHAR_Y_OFFSET.get(char)) !== null && _d !== void 0 ? _d : 0;
        return originFontSize * offsetPixel * 1;
    }
    drawText(text, leftPos, verticesData, fontColor = Color.WHITE, fontSize = 1) {
        let offset = 0;
        for (let index = 0; index < text.length; index++) {
            const char = text[index];
            const newLeftPos = vec2.fromValues(leftPos[0] + offset, leftPos[1]);
            offset += this.getDrawTextWidth(fontSize, _b.FONT_PADDING, text[index]);
            this.drawChar(char, newLeftPos, verticesData, fontColor, fontSize);
        }
    }
    drawChar(char, leftTopPos, verticesData, fontColor = Color.WHITE, fontSize = 1) {
        var _d;
        if (char.length > 1)
            throw Error("Bug detected! " + "char length is over 1");
        const charTexPos = (_d = _b.TEXTURE_POSITION_FOR_CHAR.get(char)) !== null && _d !== void 0 ? _d : vec2.fromValues(0, 0);
        leftTopPos[1] += this.getCharYOffset(fontSize, char);
        this.drawRectangleImageSize(leftTopPos, vec2.fromValues(this.getDrawTextHeight(fontSize), this.getDrawTextHeight(fontSize)), charTexPos, _b.FONT_PIXEL, _b.TEXTURE_FONT, fontColor, verticesData);
    }
    getGuiScale() {
        return this.clientIn.getGuiScale();
    }
    getDrawPos(pos) {
        return vec2Util.tomul(pos, this.getGuiScale());
    }
    getScaledScreenSize() {
        return vec2Util.todiv(this.clientIn.screenSize, this.getGuiScale());
    }
    getScreenCenter() {
        return vec2Util.todiv(this.getScaledScreenSize(), 2);
    }
    getLeftTopPosOfCenterWithSize(size, offset) {
        // center + offset - size / 2 
        const offsetedCenter = vec2.add(vec2.create(), this.getScreenCenter(), offset);
        return vec2.sub(vec2.create(), offsetedCenter, vec2Util.todiv(size, 2));
    }
    static init() {
        for (let charIndex = 0; charIndex <= 255; charIndex++) {
            const charAmountForAxis = 16;
            const charTexPos = vec2.fromValues((charIndex % charAmountForAxis) * _b.FONT_PIXEL[0], Math.floor(charIndex / charAmountForAxis) * _b.FONT_PIXEL[1]);
            _b.TEXTURE_POSITION_FOR_CHAR.set(String.fromCharCode(charIndex), charTexPos);
        }
        // register char size
        {
            _b.CHAR_SIZE.set(" ", 7);
            _b.CHAR_SIZE.set("!", 3);
            _b.CHAR_SIZE.set("\"", 4);
            _b.CHAR_SIZE.set("#", 7);
            _b.CHAR_SIZE.set("$", 6);
            _b.CHAR_SIZE.set("%", 8);
            _b.CHAR_SIZE.set("'", 2);
            _b.CHAR_SIZE.set("(", 6);
            _b.CHAR_SIZE.set(")", 6);
            _b.CHAR_SIZE.set("*", 6);
            _b.CHAR_SIZE.set("+", 8);
            _b.CHAR_SIZE.set(",", 3);
            _b.CHAR_SIZE.set("-", 5);
            _b.CHAR_SIZE.set(".", 3);
            _b.CHAR_SIZE.set("/", 5);
            _b.CHAR_SIZE.set("0", 7);
            _b.CHAR_SIZE.set("1", 5);
            _b.CHAR_SIZE.set("2", 7);
            _b.CHAR_SIZE.set("3", 6);
            _b.CHAR_SIZE.set("4", 6);
            _b.CHAR_SIZE.set("5", 6);
            _b.CHAR_SIZE.set("6", 7);
            _b.CHAR_SIZE.set("7", 6);
            _b.CHAR_SIZE.set("8", 7);
            _b.CHAR_SIZE.set("9", 7);
            _b.CHAR_SIZE.set(":", 4);
            _b.CHAR_SIZE.set(";", 4);
            _b.CHAR_SIZE.set("<", 6);
            _b.CHAR_SIZE.set("=", 6);
            _b.CHAR_SIZE.set(">", 6);
            _b.CHAR_SIZE.set("/", 5);
            _b.CHAR_SIZE.set("@", 8);
            _b.CHAR_SIZE.set("A", 6);
            _b.CHAR_SIZE.set("B", 6);
            _b.CHAR_SIZE.set("C", 6);
            _b.CHAR_SIZE.set("D", 6);
            _b.CHAR_SIZE.set("E", 6);
            _b.CHAR_SIZE.set("F", 6);
            _b.CHAR_SIZE.set("G", 6);
            _b.CHAR_SIZE.set("H", 6);
            _b.CHAR_SIZE.set("I", 5);
            _b.CHAR_SIZE.set("J", 6);
            _b.CHAR_SIZE.set("K", 6);
            _b.CHAR_SIZE.set("L", 5);
            _b.CHAR_SIZE.set("M", 8);
            _b.CHAR_SIZE.set("N", 7);
            _b.CHAR_SIZE.set("O", 7);
            _b.CHAR_SIZE.set("P", 6);
            _b.CHAR_SIZE.set("Q", 7);
            _b.CHAR_SIZE.set("R", 6);
            _b.CHAR_SIZE.set("S", 6);
            _b.CHAR_SIZE.set("T", 6);
            _b.CHAR_SIZE.set("U", 6);
            _b.CHAR_SIZE.set("V", 6);
            _b.CHAR_SIZE.set("W", 7);
            _b.CHAR_SIZE.set("X", 7);
            _b.CHAR_SIZE.set("Y", 7);
            _b.CHAR_SIZE.set("Z", 6);
            _b.CHAR_SIZE.set("[", 6);
            _b.CHAR_SIZE.set("\\", 5);
            _b.CHAR_SIZE.set("]", 6);
            _b.CHAR_SIZE.set("^", 7);
            _b.CHAR_SIZE.set("_", 5);
            _b.CHAR_SIZE.set("`", 3);
            _b.CHAR_SIZE.set("a", 7);
            _b.CHAR_SIZE.set("b", 6);
            _b.CHAR_SIZE.set("c", 6);
            _b.CHAR_SIZE.set("d", 6);
            _b.CHAR_SIZE.set("e", 6);
            _b.CHAR_SIZE.set("f", 6);
            _b.CHAR_SIZE.set("g", 6);
            _b.CHAR_SIZE.set("h", 6);
            _b.CHAR_SIZE.set("i", 3);
            _b.CHAR_SIZE.set("j", 5);
            _b.CHAR_SIZE.set("k", 5);
            _b.CHAR_SIZE.set("l", 4);
            _b.CHAR_SIZE.set("m", 7);
            _b.CHAR_SIZE.set("n", 6);
            _b.CHAR_SIZE.set("o", 6);
            _b.CHAR_SIZE.set("p", 6);
            _b.CHAR_SIZE.set("q", 6);
            _b.CHAR_SIZE.set("r", 6);
            _b.CHAR_SIZE.set("s", 6);
            _b.CHAR_SIZE.set("t", 6);
            _b.CHAR_SIZE.set("u", 6);
            _b.CHAR_SIZE.set("v", 6);
            _b.CHAR_SIZE.set("w", 7);
            _b.CHAR_SIZE.set("x", 7);
            _b.CHAR_SIZE.set("y", 6);
            _b.CHAR_SIZE.set("z", 7);
            _b.CHAR_SIZE.set("{", 6);
            _b.CHAR_SIZE.set("|", 2);
            _b.CHAR_SIZE.set("}", 6);
            _b.CHAR_SIZE.set("~", 8);
            _b.CHAR_Y_OFFSET.set("g", 1);
            _b.CHAR_Y_OFFSET.set("j", 1);
            _b.CHAR_Y_OFFSET.set("p", 1);
            _b.CHAR_Y_OFFSET.set("q", 1);
            _b.CHAR_Y_OFFSET.set("y", 1);
        }
    }
}
_b = Gui;
Gui.BUTTON_SPRITE = new NineSliceSprite(8, vec2.fromValues(8, 8), vec2.fromValues(0, 0));
Gui.TEXTURE_SOLID = new GuiTextureDefine(0, vec2.fromValues(1, 1));
Gui.TEXTURE_BG = new GuiTextureDefine(1, vec2.fromValues(256, 256));
Gui.TEXTURE_FONT = new GuiTextureDefine(2, vec2.fromValues(128, 128));
Gui.TEXTURE_POSITION_FOR_CHAR = new Map;
Gui.CHAR_SIZE = new Map;
Gui.CHAR_Y_OFFSET = new Map;
Gui.CHAR_SIZE_DEFAULT = 8;
Gui.CHAR_SIZE_HEIGHT = 8;
Gui.FONT_PIXEL = vec2.fromValues(8, 8);
Gui.FONT_PADDING = vec2.fromValues(0, 0);
Gui.FONT_SIZE_SAKUMA = 2 / 6;
Gui.FONT_SIZE_SMALL = 4 / 6;
Gui.FONT_SIZE_MIDIUM = 6 / 6;
Gui.FONT_SIZE_LARGE = 8 / 6;
(() => {
    _b.init();
})();
class GuiUtil {
    constructor(gui) {
        this.gui = gui;
    }
    drawTextCenter(text, offset, verticesData, color, fontSize, centerX = true, centerY = true) {
        const screenSIze = this.gui.getScaledScreenSize();
        const centerXPos = centerX ? screenSIze[0] / 2 - this.gui.getDrawTextWidth(fontSize, undefined, text) / 2 : 0;
        const centerYPos = centerY ? screenSIze[1] / 2 - this.gui.getDrawTextHeight(fontSize, undefined) / 2 : 0;
        const pos = vec2.fromValues(centerXPos + offset[0], centerYPos + offset[1]);
        this.gui.drawText(text, pos, verticesData, color, fontSize);
    }
    getButtonPos(button, xOffset, yOffset) {
        return this.gui.getLeftTopPosOfCenterWithSize(button.size.get(), vec2.fromValues(xOffset, yOffset));
    }
    drawTextLine(lines, leftPos, verticesData, fontColor = Color.WHITE, fontSize = 1) {
        let offset = 0;
        for (const line of lines) {
            const newLeftPos = vec2.fromValues(leftPos[0], leftPos[1] + offset);
            this.gui.drawText(line, newLeftPos, verticesData, fontColor, fontSize);
            offset += this.gui.getDrawTextHeight(fontSize, Gui.FONT_PADDING);
        }
    }
}
class GuiScreen extends Gui {
    constructor() {
        super(...arguments);
        this.focusedComponent = null;
        this.components = [];
    }
    setupVertices(verticesData, partialTicks, cam) {
        super.setupVertices(verticesData, partialTicks, cam);
        this.drawBackground(verticesData, partialTicks);
        this.components.sort(GuiComponent.getLayerComparator);
        for (const component of this.components) {
            component.setupVertices(verticesData, partialTicks, cam);
        }
        this.drawForeground(verticesData, partialTicks);
    }
    setupDebugVertices(verticesData, partialTicks, cam) {
        this.components.sort(GuiComponent.getLayerComparator);
        for (const component of this.components) {
            component.setupDebugVertices(verticesData, partialTicks, cam);
        }
    }
    drawBackground(verticesData, partialTicks) {
    }
    drawForeground(verticesData, partialTicks) {
    }
    onMousePressed(mousePos, event) {
        for (const component of this.components) {
            if (component.onMousePressed(mousePos, event)) {
                this.focusedComponent = component;
                this.onComponentMousePressed(component);
            }
        }
    }
    ;
    onMouseReleased(mousePos, event) {
        for (const component of this.components) {
            if (component.onMouseReleased(mousePos, event)) {
                this.onComponentMouseReleased(component);
            }
        }
    }
    ;
    onMouseMoved(mousePos, event) {
        for (const component of this.components) {
            if (component.onMouseMoved(mousePos, event)) {
                this.onComponentMouseMoved(component);
            }
        }
    }
    ;
    onComponentMousePressed(component) {
    }
    onComponentMouseReleased(component) {
    }
    onComponentMouseMoved(component) {
    }
    addComponent(component) {
        component.initGui(this.clientIn);
        this.components.push(component);
        return component;
    }
    isControlable() {
        return false;
    }
}
// type NotFunction<T> = T extends (...args: any) => any ? never : T;
class DynamicValue {
    constructor(value) {
        if ('function' === typeof value) {
            this.valueGetter = value;
            this.isDynamicValue = true;
        }
        else {
            this.valueGetter = () => value;
            this.valueCache = value;
            this.isDynamicValue = false;
        }
    }
    get() {
        if (!this.isDynamicValue && this.valueCache != null)
            return this.valueCache;
        this.valueCache = this.valueGetter();
        return this.valueCache;
    }
}
class GuiComponent extends Gui {
    constructor(parent, pos, size, layer = 1) {
        super();
        this.padding = 0;
        this.parent = parent;
        this.pos = new DynamicValue(pos);
        this.size = new DynamicValue(size);
        this.layer = layer;
    }
    setupDebugVertices(verticesData, partialTicks, cam) {
        const pos = this.getRenderPos();
        const size = this.getRenderSize();
        const start = vec2.fromValues(pos[0], pos[1]);
        const end = vec2.fromValues(pos[0] + size[0], pos[1] + size[1]);
        this.addRectToDebugVertices(verticesData, start, end, Color.RED);
        const padding = this.padding * this.getGuiScale();
        const start2 = vec2.fromValues(start[0] - padding, start[1] - padding);
        const end2 = vec2.fromValues(end[0] + padding, end[1] + padding);
        this.addRectToDebugVertices(verticesData, start2, end2, Color.GREEN);
    }
    addRectToDebugVertices(verticesData, start, end, color) {
        let offset = verticesData.position.length / 2;
        verticesData.position.push(start[0], end[1]);
        verticesData.position.push(end[0], end[1]);
        verticesData.position.push(end[0], start[1]);
        verticesData.position.push(start[0], start[1]);
        verticesData.textureColor.push(...color);
        verticesData.textureColor.push(...color);
        verticesData.textureColor.push(...color);
        verticesData.textureColor.push(...color);
        verticesData.indices.push(...[0, 1, 1, 2, 2, 3, 3, 0].map(value => value + offset));
    }
    static getLayerComparator(a, b) {
        return a.layer - b.layer;
    }
    getCenterPos() {
        const pos = this.pos.get();
        const size = this.size.get();
        return vec2.add(vec2.create(), pos, vec2Util.todiv(size, 2));
    }
    onMousePressed(mousePos, event) {
        return false;
    }
    ;
    onMouseReleased(mousePos, event) {
        return false;
    }
    ;
    onMouseMoved(mousePos, event) {
        return false;
    }
    ;
    isFocused() {
        return this.parent.focusedComponent == this;
    }
    getRenderPos() {
        return vec2Util.tomul(this.pos.get(), this.getGuiScale());
    }
    getRenderSize() {
        return vec2Util.tomul(this.size.get(), this.getGuiScale());
    }
    isInArea(mousePos) {
        const padding = this.padding * this.getGuiScale();
        const pos = this.getRenderPos();
        const size = this.getRenderSize();
        return mousePos[0] >= pos[0] - padding && mousePos[1] >= pos[1] - padding && mousePos[0] < pos[0] + size[0] + padding && mousePos[1] < pos[1] + size[1] + padding;
    }
}
class GuiComponentButton extends GuiComponent {
    constructor(parent, pos, size, text, layer = 1) {
        super(parent, pos, size, layer);
        this.isDisable = false;
        this.text = new DynamicValue(text);
        this.padding = 4;
    }
    onMousePressed(mousePos, event) {
        return !this.isDisable && this.isInArea(mousePos);
    }
    onMouseReleased(mousePos, event) {
        return this.isInArea(mousePos);
    }
    onMouseMoved(mousePos, event) {
        return this.isInArea(mousePos);
    }
    setupVertices(verticesData, partialTicks, cam) {
        this.drawNineSlice(this.pos.get(), this.size.get(), Gui.BUTTON_SPRITE, Gui.TEXTURE_BG, undefined, verticesData);
        const centerPos = this.getCenterPos();
        const text = this.text.get();
        const size = Gui.FONT_SIZE_MIDIUM;
        const textSize = this.getDrawTextSize(size, undefined, text);
        this.drawText(text, vec2.add(vec2.create(), centerPos, vec2Util.todiv(textSize, -2)), verticesData, Color.BLACK, size);
    }
}
class GuiDebug extends GuiScreen {
    drawForeground(verticesData, partialTicks) {
        this.drawDebug(verticesData, partialTicks);
    }
    drawDebug(verticesData, partialTicks) {
        const player = this.clientIn.entityPlayer;
        const serverPlayer = DebugUtil.getServerPlayer(this.clientIn);
        const cam = this.clientIn.cam;
        const camSection = new Array;
        camSection.push("Cam");
        camSection.push(`posX:${cam.pos[0].toFixed(3)}`);
        camSection.push(`posY:${cam.pos[1].toFixed(3)}`);
        camSection.push(`posZ:${cam.pos[2].toFixed(3)}`);
        camSection.push(`yaw:${cam.dir[1].toFixed(3)} `);
        camSection.push(`pitch:${cam.dir[0].toFixed(3)} `);
        const playerSection = player == null ? [] : this.getPlayerDebugText(player, partialTicks);
        playerSection.unshift("Player");
        const playerServerSection = serverPlayer == null ? [] : this.getPlayerDebugText(serverPlayer, partialTicks);
        playerServerSection.unshift("ServerPlayer");
        this.guiUtil.drawTextLine(camSection, vec2.fromValues(0, 100), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
        if (player != null)
            this.guiUtil.drawTextLine(playerSection, vec2.fromValues(50, 100), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
        if (serverPlayer != null)
            this.guiUtil.drawTextLine(playerServerSection, vec2.fromValues(100, 100), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
        this.drawText("" + (player === null || player === void 0 ? void 0 : player.uuid), vec2.fromValues(50, 100 - this.getDrawTextHeight(Gui.FONT_SIZE_SAKUMA, Gui.FONT_PADDING)), verticesData, Color.WHITE, Gui.FONT_SIZE_SAKUMA);
    }
    getPlayerDebugText(player, partialTicks) {
        const playerSection = new Array;
        playerSection.push(`posX:${player.posX().toFixed(3)} `);
        playerSection.push(`posY:${player.posY().toFixed(3)} `);
        playerSection.push(`posZ:${player.posZ().toFixed(3)} `);
        playerSection.push(`velX:${player.velocityX().toFixed(3)} `);
        playerSection.push(`velY:${player.velocityY().toFixed(3)} `);
        playerSection.push(`velZ:${player.velocityZ().toFixed(3)} `);
        playerSection.push(`rota:${player.rotation.get().toFixed(3)} `);
        playerSection.push(`heal:${player.health.get().toFixed(3)} `);
        playerSection.push(`xp:${player.xpPoint.get().toFixed(3)} `);
        playerSection.push(`lvl:${player.xpLevel.get()} `);
        playerSection.push(`tick:${player.ticksAlived + partialTicks} `);
        return playerSection;
    }
}
class GuiHud extends GuiScreen {
    initGui(clientIn) {
        super.initGui(clientIn);
    }
    drawForeground(verticesData, partialTicks) {
        if (Core.renderPerf) {
            this.drawText(`fps:${clientFlamePerf.frameParSec}`, vec2.fromValues(0, 512), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
            this.drawText(`tps:${clientTickPerf.frameParSec}`, vec2.fromValues(0, 544), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
            this.drawText(`stps:${serverTickPerf.frameParSec}`, vec2.fromValues(0, 576), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
        }
        this.drawPlayersData(verticesData, partialTicks);
        this.drawPlayerDetail(verticesData, partialTicks);
    }
    static getHealthColor(healthRadio) {
    }
    drawPlayersData(verticesData, partialTicks) {
        var _d;
        let i = 0;
        for (const [uuid, playerData] of this.clientIn.playersData.entries()) {
            // const player = this.clientIn.entities.getByUUID(uuid);
            let userName = (_d = playerData.name) !== null && _d !== void 0 ? _d : "???";
            const height = 10;
            const nameHeight = this.getDrawTextHeight(Gui.FONT_SIZE_SMALL);
            const healthMaxWidth = 50;
            const healthHeight = 3;
            const yPos = i * height;
            const playerName = userName + " " + playerData.health.toFixed(0);
            const playerUuid = `(${uuid})`;
            const playerNameWidth = this.getDrawTextWidth(Gui.FONT_SIZE_MIDIUM, Gui.FONT_PADDING, playerName);
            const basePos = vec2.fromValues(4, 4 + yPos);
            this.drawText(userName, vec2Util.toadd(basePos, 1, 1), verticesData, Color.BLACK, Gui.FONT_SIZE_SMALL);
            this.drawText(userName, vec2Util.toadd(basePos, 0, 0), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
            if (Core.debugtext) {
                this.drawText(playerUuid, vec2Util.toadd(basePos, playerNameWidth, 0), verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
            }
            const healthWidth = playerData.health / playerData.maxHealth * healthMaxWidth;
            const healthPos = vec2Util.toadd(basePos, 0, height - healthHeight);
            const healthMaxSize = vec2.fromValues(healthMaxWidth, healthHeight);
            const healthSize = vec2.fromValues(healthWidth, healthHeight);
            // this.drawRectangleSolid(vec2Util.tosub(healthPos, 1), vec2Util.toadd(healthMaxSize, 2), Color.BLACK, verticesData);
            // this.drawRectangleSolid(healthPos, healthMaxSize, Color.GRAY, verticesData);
            this.drawRectangleSolid(healthPos, healthSize, Color.GREEN, verticesData);
            i++;
        }
    }
    drawPlayerDetail(verticesData, partialTicks) {
        const player = this.clientIn.entityPlayer;
        const padding = 32;
        const basePos = vec2.fromValues(padding, -padding + this.getScaledScreenSize()[1]);
        const healthPadding = 2;
        const healthMaxWidth = 100;
        const healthWidth = player.health.get() / player.getMaxHealth() * healthMaxWidth;
        const healthHeight = 5;
        const healthPos = vec2Util.toadd(basePos, 0, 10);
        this.drawRectangleSolid(healthPos, vec2.fromValues(healthMaxWidth, healthHeight), GuiHud.HEALTH_BACK_GROUND_COLOR, verticesData);
        this.drawRectangleSolid(healthPos, vec2.fromValues(healthWidth, healthHeight), Color.GREEN, verticesData);
        const xpPointMaxWidth = 100 / 4 * 3;
        const xpPointWidth = player.xpPoint.get() / player.getMaxXpPoint() * xpPointMaxWidth;
        const xpPointHeight = 3;
        const levelPos = vec2Util.toadd(healthPos, 0, healthHeight + healthPadding);
        this.drawRectangleSolid(levelPos, vec2.fromValues(xpPointMaxWidth, xpPointHeight), GuiHud.HEALTH_BACK_GROUND_COLOR, verticesData);
        this.drawRectangleSolid(levelPos, vec2.fromValues(xpPointWidth, xpPointHeight), Color.CYAN, verticesData);
        const healthTextPos = vec2Util.toadd(healthPos, healthMaxWidth, 0);
        this.drawText(Math.ceil(player.health.get()).toFixed(0), healthTextPos, verticesData, Color.WHITE, Gui.FONT_SIZE_SMALL);
        const levelTextPos = vec2Util.toadd(levelPos, xpPointMaxWidth, 0);
        this.drawText("lv" + Math.ceil(player.xpLevel.get()).toFixed(0), levelTextPos, verticesData, Color.CYAN, Gui.FONT_SIZE_SMALL);
    }
}
GuiHud.HEALTH_BACK_GROUND_COLOR = vec4.fromValues(1.0, 1.0, 1.0, 0.5);
class GuiDeath extends GuiScreen {
    initGui(clientIn) {
        super.initGui(clientIn);
        this.respawnButton = this.addComponent(new GuiComponentButton(this, () => this.guiUtil.getButtonPos(this.respawnButton, 0, 64), () => GuiTitle.BUTTON_SIZE, () => "Respawn"));
    }
    drawBackground(verticesData, partialTicks) {
        this.drawRectangleSolid(vec2.fromValues(0, 0), this.clientIn.screenSize, vec4.fromValues(1, 0, 0, 0.5), verticesData);
    }
    drawForeground(verticesData, partialTicks) {
    }
    onComponentMousePressed(component) {
        if (component == this.respawnButton) {
            this.clientIn.send(new PacketToServerPlayerRespawn());
            this.clientIn.openGui(null);
        }
    }
}
class GuiTitle extends GuiScreen {
    initGui(clientIn) {
        super.initGui(clientIn);
        this.singlePlayerButton = this.addComponent(new GuiComponentButton(this, () => this.guiUtil.getButtonPos(this.singlePlayerButton, 0, -20), () => GuiTitle.BUTTON_SIZE, () => "SinglePlayer"));
        this.multiPlayerButton = this.addComponent(new GuiComponentButton(this, () => this.guiUtil.getButtonPos(this.multiPlayerButton, 0, 20), () => GuiTitle.BUTTON_SIZE, () => "MultiPlayer"));
        this.optionButton = this.addComponent(new GuiComponentButton(this, () => this.guiUtil.getButtonPos(this.optionButton, 0, 60), () => GuiTitle.BUTTON_SIZE, () => "Options"));
    }
    drawBackground(verticesData, partialTicks) {
        // this.addRectangleSolid(vec2.fromValues(0, 0), this.clientIn.screenSize, vec4.fromValues(0, 0, 1, 0.5), verticesData)
    }
    drawForeground(verticesData, partialTicks) {
        const title = `Infini Dungeons`;
        this.drawText(title, vec2.fromValues(this.getScreenCenter()[0] - this.getDrawTextWidth(Gui.FONT_SIZE_LARGE, undefined, title) / 2, 24), verticesData, Color.BLACK, Gui.FONT_SIZE_LARGE);
    }
    onComponentMousePressed(component) {
        var _d;
        if (component == this.singlePlayerButton) {
            this.clientIn.offLineInit();
        }
        if (component == this.multiPlayerButton) {
            this.clientIn.onLineInit((_d = prompt("url", `ws://localhost:8001`)) !== null && _d !== void 0 ? _d : "");
        }
    }
}
GuiTitle.BUTTON_SIZE = vec2.fromValues(80, 12);
class GuiConnect extends GuiScreen {
}
class GuiDisonnect extends GuiScreen {
    constructor(code, msg) {
        super();
        this.code = code;
        this.msg = msg;
    }
    initGui(clientIn) {
        super.initGui(clientIn);
        this.okButton = this.addComponent(new GuiComponentButton(this, () => this.guiUtil.getButtonPos(this.okButton, 0, 64), () => GuiTitle.BUTTON_SIZE, () => "Ok"));
    }
    drawForeground(verticesData, partialTicks) {
        this.guiUtil.drawTextCenter(`Disconnected`, vec2.fromValues(0, 16), verticesData, Color.BLACK, Gui.FONT_SIZE_LARGE, true, false);
        this.guiUtil.drawTextCenter("code: " + this.code, vec2.fromValues(0, -16), verticesData, Color.BLACK, Gui.FONT_SIZE_MIDIUM, true, true);
        this.guiUtil.drawTextCenter(this.msg, vec2.fromValues(0, 0), verticesData, Color.BLACK, Gui.FONT_SIZE_MIDIUM, true, true);
    }
    onComponentMousePressed(component) {
        if (component == this.okButton) {
            this.clientIn.openGui(new GuiTitle);
        }
    }
}
GuiDisonnect.BUTTON_SIZE = vec2.fromValues(500, 75);
var Anchor;
(function (Anchor) {
    Anchor[Anchor["LEFT"] = 0] = "LEFT";
    Anchor[Anchor["CENTER"] = 1] = "CENTER";
    Anchor[Anchor["RIGHT"] = 2] = "RIGHT";
    Anchor[Anchor["TOP"] = 3] = "TOP";
    Anchor[Anchor["BOTTOM"] = 4] = "BOTTOM";
})(Anchor || (Anchor = {}));
class Anchors {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// #region Core
class Core {
    static serverInit(serverIns, clientIns) {
        serverIns.onLineInit();
        if (process != null) {
            process.on('SIGINT', () => {
                console.log('Server is shutting down...');
                serverIns.kickAll(1000, "Server is shutting down");
                process.exit(0);
            });
        }
    }
    static clientInit(clientIns) {
        try {
            clientIns.titleInit();
        }
        catch (e) {
            clientIns.crash(e);
        }
    }
}
Core.debugFreeCam = false;
Core.debugtext = false;
Core.debugGuiRect = false;
Core.debugInteriorCulling = true;
Core.debugfaceCulling = true;
Core.debugDoDiscardOnDeath = true;
Core.debugLinesRender = false;
Core.debugPathRender = false;
Core.debugBBRender = false;
Core.debugEntitySpawn = true;
Core.debugPacketLog = false;
Core.renderPerf = true;
class MathUtil {
    static warpDegrees(value) {
        let degree = value % 360;
        if (degree >= 180) {
            degree -= 360;
        }
        if (degree < -180) {
            degree += 360;
        }
        return degree;
    }
}
_c = MathUtil;
MathUtil.toRadian = (degree) => degree * (Math.PI / 180);
MathUtil.toDegree = (radian) => radian * (180 / Math.PI);
MathUtil.clamp = (min, value, max) => Math.max(min, Math.min(value, max));
MathUtil.between = (min, value, max) => value >= min && value <= max;
MathUtil.calcAngleDegrees = (x, y) => _c.toDegree(Math.atan2(y, x));
MathUtil.random = (min, max) => Math.random() * (max - min) + min;
MathUtil.randomInt = (min, max) => Math.round(_c.random(min, max));
MathUtil.randomBool = () => Math.random() >= 0.5;
MathUtil.getDistance1 = (ax, bx) => ax - bx;
MathUtil.getDistance2 = (ax, ay, bx, by) => Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
MathUtil.getDistance3 = (ax, ay, az, bx, by, bz) => Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2) + Math.pow(az - bz, 2));
MathUtil.getLength1 = (ax) => Math.sqrt(Math.pow(ax, 2));
MathUtil.getLength2 = (ax, ay) => Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2));
MathUtil.getLength3 = (ax, ay, az) => Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
MathUtil.lerp = (value, min, max) => min + (max - min) * value;
MathUtil.rotLerp = (value, min, max) => min + _c.warpDegrees(max - min) * value;
MathUtil.rotatedMove = (moveVel, yaw, speed = 1) => {
    let radiansX = _c.toRadian(yaw + 90);
    let radiansZ = _c.toRadian(yaw);
    let moveX = Math.sin(radiansZ) * moveVel[2] + Math.sin(radiansX) * moveVel[0];
    let moveY = moveVel[1];
    let moveZ = Math.cos(radiansZ) * moveVel[2] + Math.cos(radiansX) * moveVel[0];
    return vec3Util.tomul(vec3.normalize(vec3.create(), vec3.fromValues(moveX, moveY, moveZ)), speed);
};
// thanks https://easings.net
class Easing {
}
Easing.easeOutExpo = (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
Easing.easeInExpo = (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10);
class Util {
    static getterOrValueToGetter(value) {
        if ('function' === typeof value) {
            return value;
        }
        return () => value;
    }
    static bufferToArrayBuffer(buffer) {
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; i++) {
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }
    static blobToArrayBuffer(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result !== null) {
                        resolve(reader.result);
                    }
                    else {
                        reject(new Error("Failed to read blob as ArrayBuffer"));
                    }
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });
        });
    }
}
Util.getSorterEntityDistanceBy = (source) => (a, b) => MathUtil.getDistance3(source.pos[0], source.pos[1], source.pos[2], a.pos[0], a.pos[1], a.pos[2]) - MathUtil.getDistance3(source.pos[0], source.pos[1], source.pos[2], b.pos[0], b.pos[1], b.pos[2]);
Util.vec3ArrayToFloat32Array = (vec3Array) => new Float32Array(vec3Array.flatMap(vec3 => [vec3[0], vec3[1], vec3[2]]));
Util.vec2ArrayToFloat32Array = (vec2Array) => new Float32Array(vec2Array.flatMap(vec2 => [vec2[0], vec2[1]]));
Util.vec3ArrayToArray = (vec3Array) => vec3Array.flatMap(vec3 => [vec3[0], vec3[1], vec3[2]]);
Util.vec2ArrayToArray = (vec2Array) => vec2Array.flatMap(vec2 => [vec2[0], vec2[1]]);
Util.stringInsert = (string, insert, at) => string.slice(0, at) + insert + string.slice(at);
class DataViewUtil {
    static writeString(view, offset, str) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(str);
        view.setUint8(offset, encoded.length); // 1バイトに文字列の長さを格納
        for (let i = 0; i < encoded.length; i++) {
            view.setUint8(offset + 1 + i, encoded[i]);
        }
        return encoded.length + 1; // 書き込んだバイト数
    }
    static writeStringExtend(view, str) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(str);
        view.writeUint8(encoded.length); // 1バイトに文字列の長さを格納
        for (let i = 0; i < encoded.length; i++) {
            view.writeUint8(encoded[i]);
        }
        return encoded.length + 1; // 書き込んだバイト数
    }
    static readString(view, offset) {
        const length = view.getUint8(offset); // 最初のバイトから長さを取得
        const bytes = new Uint8Array(view.buffer, offset + 1, length);
        return new TextDecoder().decode(bytes);
    }
    static readStringExtend(view) {
        const length = view.readUint8(); // 最初のバイトから長さを取得
        // console.log("str", length, view.index, view.byteLength)
        const bytes = new Uint8Array(view.buffer, view.index, length);
        view.incrementIndex(length);
        return new TextDecoder().decode(bytes);
    }
    static getStringBytes(str) {
        return (1 + str.length) * Int8Array.BYTES_PER_ELEMENT;
    }
    static writeUUID(view, offset, uuid) {
        const hex = uuid.replace(/-/g, ""); // ハイフンを削除して32文字の16進数にする
        if (hex.length !== 32) {
            throw new Error("Invalid UUID format");
        }
        for (let i = 0; i < 16; i++) {
            const byte = parseInt(hex.substr(i * 2, 2), 16); // 2文字ごとにパース
            view.setUint8(offset + i, byte);
        }
    }
    static writeUUIDExtend(view, uuid) {
        const hex = uuid.replace(/-/g, ""); // ハイフンを削除して32文字の16進数にする
        if (hex.length !== 32) {
            throw new Error("Invalid UUID format");
        }
        for (let i = 0; i < 16; i++) {
            const byte = parseInt(hex.substr(i * 2, 2), 16); // 2文字ごとにパース
            view.writeUint8(byte);
        }
    }
    static readUUID(view, offset) {
        let hex = "";
        for (let i = 0; i < 16; i++) {
            hex += view.getUint8(offset + i).toString(16).padStart(2, "0"); // 16進数文字列に変換
        }
        // ハイフンを追加して標準的なUUID形式にする
        return (hex.substring(0, 8) + "-" +
            hex.substring(8, 12) + "-" +
            hex.substring(12, 16) + "-" +
            hex.substring(16, 20) + "-" +
            hex.substring(20));
    }
    static readUUIDExtend(view) {
        let hex = "";
        for (let i = 0; i < 16; i++) {
            hex += view.readUint8().toString(16).padStart(2, "0"); // 16進数文字列に変換
        }
        // ハイフンを追加して標準的なUUID形式にする
        return (hex.substring(0, 8) + "-" +
            hex.substring(8, 12) + "-" +
            hex.substring(12, 16) + "-" +
            hex.substring(16, 20) + "-" +
            hex.substring(20));
    }
}
DataViewUtil.UUID_BYTES = Uint8Array.BYTES_PER_ELEMENT * 16;
class TypeUtil {
    static isUUID(value) { return typeof value === "string" && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value); }
    ;
    static isBoolean(value) { return typeof value === "boolean"; }
    ;
    static isNumber(value) { return typeof value === "number"; }
    ;
    static isFiniteNumber(value) { return typeof value === "number" && isFinite(value); }
    ;
    static isBigint(value) { return typeof value === "bigint"; }
    ;
    static isString(value) { return typeof value === "string"; }
    ;
    static isObject(value) { return typeof value === "object"; }
    ;
    static isNonNull(value) { return value != null; }
    ;
    static isNonNullObject(value) { return this.isObject(value) && this.isNonNull(value); }
    ;
    static isNumberArray(values) { return Array.isArray(values) && values.every(value => TypeUtil.isNumber(value)); }
    ;
    static isFiniteNumberArray(values) { return Array.isArray(values) && values.every(value => TypeUtil.isFiniteNumber(value)); }
    ;
}
class DebugUtil {
    static getServerPlayer(clientIn) {
        if (!clientIn.isOffline)
            return null;
        const playerUuid = clientIn.entityPlayer.uuid;
        const entity = clientIn.integratedServer.entities.getByUUID(playerUuid);
        if (entity instanceof EntityPlayerServer)
            return entity;
        return null;
    }
}
var FinalizationRegistry; // 型定義
var finalizationRegistry;
var finalizationRegistryID = new Map;
function debugRegisterFinalization(obj, name) {
    var _d;
    if (typeof FinalizationRegistry !== 'undefined') {
        if (finalizationRegistry == null) {
            finalizationRegistry = new FinalizationRegistry((id) => {
                console.log(`${id} was gabage collected`);
            });
        }
        const id = (_d = finalizationRegistryID.get(name)) !== null && _d !== void 0 ? _d : 0;
        finalizationRegistry.register(obj, name + "_" + id);
        finalizationRegistryID.set(name, id + 1);
    }
}
function objMap(object, callbackFnc) {
    const result = {};
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result[key] = callbackFnc(key, object[key]);
        }
    }
    return result;
}
let sr;
let cl;
{
    //init
    PacketHandler.initPacket();
    if (isDedicatedServer) {
        const serverIns = new DedicatedServer;
        Core.serverInit(serverIns, undefined);
        sr = serverIns;
    }
    else {
        const clientIns = new Client;
        Core.clientInit(clientIns);
        cl = clientIns;
    }
}
//# sourceMappingURL=script.js.map
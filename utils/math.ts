export interface Vector2 {
    x: number
    y: number
}

export interface Vector2String {
    x: number | string
    y: number | string
}

export interface Vector3 extends Vector2{
    z: number
}

export function minVector2(p1: Vector2, p2: Vector2): Vector2 {
    return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y)
    };
}

export function isLeftVectorMin(p1: Vector2, p2: Vector2): Vector2 {
    const sum1 = p1.x + p1.y;
    const sum2 = p2.x + p2.y;
    return sum1 <= sum2 ? p1 : p2;
}

export function maxVector2(p1: Vector2, p2: Vector2): Vector2 {
    return {
        x: Math.max(p1.x, p2.x),
        y: Math.max(p1.y, p2.y)
    };
}
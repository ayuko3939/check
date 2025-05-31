"use strict";
// ===========================================
// ゲーム定数定義（設定値を一箇所で管理）
// ===========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME = exports.PADDLE = exports.BALL = exports.CANVAS = void 0;
// 画面サイズ
exports.CANVAS = {
    WIDTH: 800,
    HEIGHT: 600,
};
// ボール設定
exports.BALL = {
    RADIUS: 10,
    DEFAULT_SPEED: 3,
};
// パドル設定
exports.PADDLE = {
    WIDTH: 10,
    HEIGHT: 100,
    LEFT_X: 50, // 左パドルのX座標
    RIGHT_X: 740, // 右パドルのX座標（800 - 50 - 10）
    MOVE_SPEED: 10, // キー押下時の移動量
};
// ゲーム設定
exports.GAME = {
    DEFAULT_WINNING_SCORE: 10,
    WINNING_SCORE_OPTIONS: [5, 10, 15, 20],
    COUNTDOWN_SECONDS: 5,
    FPS: 60,
};

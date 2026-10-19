"""OKLAB helpers: conversion to sRGB and WCAG 2 contrast. No dependencies."""
import math

def oklab_to_linear_srgb(L, a, b):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    return (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )

def in_gamut(L, a, b, eps=1e-4):
    return all(-eps <= c <= 1 + eps for c in oklab_to_linear_srgb(L, a, b))

def _enc(c):
    c = min(1.0, max(0.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055

def to_hex(L, a, b):
    return "#" + "".join(f"{round(_enc(c) * 255):02X}" for c in oklab_to_linear_srgb(L, a, b))

def to_srgb01(L, a, b):
    return tuple(_enc(c) for c in oklab_to_linear_srgb(L, a, b))

def luminance(L, a, b):
    r, g, bl = (min(1.0, max(0.0, c)) for c in oklab_to_linear_srgb(L, a, b))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl

def contrast(c1, c2):
    y1, y2 = luminance(*c1[:3]), luminance(*c2[:3])
    hi, lo = max(y1, y2), min(y1, y2)
    return (hi + 0.05) / (lo + 0.05)

def lch(L, a, b):
    return L, math.hypot(a, b), (math.degrees(math.atan2(b, a)) % 360)

def from_lch(L, C, h):
    return L, C * math.cos(math.radians(h)), C * math.sin(math.radians(h))

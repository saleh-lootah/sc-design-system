// Generated — edit tokens/*.json
// Colours are converted from OKLAB to sRGB with the maths in scripts/oklab.py.
// The source OKLAB value is in the comment beside each component set.

import SwiftUI
import UIKit

private func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ a: CGFloat = 1) -> UIColor {
    UIColor(red: r, green: g, blue: b, alpha: a)
}

private func scDynamic(light: UIColor, dark: UIColor) -> Color {
    Color(UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })
}

// MARK: - Colour

public extension Color {
    /// App/page background behind cards
    static let scCanvas = scDynamic(
        light: rgb(0.9684, 0.9681, 0.9712), // oklab(0.976 0.0004 -0.001)
        dark: rgb(0.066, 0.0663, 0.0742) // oklab(0.178 0.001 -0.004)
    )
    /// Grouped-list background
    static let scGrouped = scDynamic(
        light: rgb(0.9371, 0.9377, 0.9467), // oklab(0.953 0.0007 -0.003)
        dark: rgb(0.066, 0.0663, 0.0742) // oklab(0.178 0.001 -0.004)
    )
    /// Cards, sheets, fields
    static let scSurface = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1268, 0.1254, 0.1366) // oklab(0.245 0.002 -0.005)
    )
    /// Decorative dividers (not a control boundary)
    static let scRule = scDynamic(
        light: rgb(0.894, 0.8946, 0.9066), // oklab(0.92 0.001 -0.004)
        dark: rgb(0.1995, 0.2003, 0.2187) // oklab(0.323 0.002 -0.008)
    )
    /// Control boundaries and inactive progress, >=3:1
    static let scControl = scDynamic(
        light: rgb(0.4515, 0.4511, 0.4779), // oklab(0.558 0.003 -0.01)
        dark: rgb(0.5809, 0.5805, 0.6086) // oklab(0.669 0.003 -0.01)
    )
    /// Secondary text, >=4.5:1 on surface and canvas
    static let scMuted = scDynamic(
        light: rgb(0.3837, 0.3846, 0.4052), // oklab(0.498 0.002 -0.008)
        dark: rgb(0.7412, 0.7413, 0.7618) // oklab(0.8 0.002 -0.007)
    )
    /// Primary text
    static let scInk = scDynamic(
        light: rgb(0.1268, 0.1254, 0.1366), // oklab(0.245 0.002 -0.005)
        dark: rgb(1, 1, 1) // oklab(1 0 0)
    )
    /// Headings and display
    static let scInkStrong = scDynamic(
        light: rgb(0.066, 0.0663, 0.0742), // oklab(0.178 0.001 -0.004)
        dark: rgb(1, 1, 1) // oklab(1 0 0)
    )
    /// Text and icons on channel action colour
    static let scOnAction = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.066, 0.0663, 0.0742) // oklab(0.178 0.001 -0.004)
    )
    /// Translucent bar fill (Liquid Glass approximation)
    static let scGlass = scDynamic(
        light: rgb(1, 1, 1, 0.72), // oklab(1 0 0 / 0.72)
        dark: rgb(0.1574, 0.1574, 0.1731, 0.72) // oklab(0.279 0.002 -0.007 / 0.72)
    )
    /// Hairline edge on glass
    static let scGlassEdge = scDynamic(
        light: rgb(1, 1, 1, 0.9), // oklab(1 0 0 / 0.9)
        dark: rgb(1, 1, 1, 0.14) // oklab(1 0 0 / 0.14)
    )
    /// Quiet control fill
    static let scFillQuiet = scDynamic(
        light: rgb(0.4691, 0.4705, 0.5024, 0.14), // oklab(0.575 0.003 -0.012 / 0.14)
        dark: rgb(1, 1, 1, 0.1) // oklab(1 0 0 / 0.1)
    )
    /// Selected nav item fill
    static let scFillSelected = scDynamic(
        light: rgb(0.4691, 0.4705, 0.5024, 0.16), // oklab(0.575 0.003 -0.012 / 0.16)
        dark: rgb(1, 1, 1, 0.14) // oklab(1 0 0 / 0.14)
    )
    static let scError = scDynamic(
        light: rgb(0.679, 0.1884, 0.161), // oklab(0.501 0.144 0.076)
        dark: rgb(0.9997, 0.6975, 0.6625) // oklab(0.834 0.082 0.041)
    )
    static let scErrorHover = scDynamic(
        light: rgb(0.6275, 0.1618, 0.1374), // oklab(0.47 0.138 0.073)
        dark: rgb(0.954, 0.6553, 0.6209) // oklab(0.8 0.082 0.041)
    )
    static let scErrorPressed = scDynamic(
        light: rgb(0.5782, 0.1367, 0.1152), // oklab(0.44 0.132 0.07)
        dark: rgb(0.9139, 0.6183, 0.5847) // oklab(0.77 0.082 0.041)
    )
    /// Text and icons on error fill
    static let scOnError = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.066, 0.0663, 0.0742) // oklab(0.178 0.001 -0.004)
    )
    static let scErrorSurface = scDynamic(
        light: rgb(1, 0.9417, 0.9381), // oklab(0.967 0.015 0.006)
        dark: rgb(0.2742, 0.1327, 0.1193) // oklab(0.3 0.05 0.025)
    )
    static let scSuccess = scDynamic(
        light: rgb(0.1472, 0.388, 0.2293), // oklab(0.448 -0.081 0.043)
        dark: rgb(0.5712, 0.845, 0.635) // oklab(0.82 -0.09 0.05)
    )
    static let scSuccessSurface = scDynamic(
        light: rgb(0.9237, 0.9685, 0.9329), // oklab(0.965 -0.015 0.008)
        dark: rgb(0.086, 0.1981, 0.1167) // oklab(0.29 -0.045 0.025)
    )
    static let scWarning = scDynamic(
        light: rgb(0.482, 0.3181, 0), // oklab(0.47 0.026 0.096)
        dark: rgb(0.9754, 0.7493, 0.4081) // oklab(0.84 0.03 0.12)
    )
    static let scWarningSurface = scDynamic(
        light: rgb(1, 0.9568, 0.8678), // oklab(0.97 0.003 0.032)
        dark: rgb(0.2485, 0.1575, 0.0466) // oklab(0.3 0.02 0.05)
    )
    /// Base shadow colour; elevation tokens set their own alpha
    static let scShadow = scDynamic(
        light: rgb(0, 0, 0, 0.05), // oklab(0 0 0 / 0.05)
        dark: rgb(0, 0, 0, 0.35) // oklab(0 0 0 / 0.35)
    )
}

// MARK: - Channels

public struct SCChannel: Sendable {
    public let name: String
    public let action: Color
    public let actionHover: Color
    public let actionPressed: Color
    public let washStart: Color
    public let washEnd: Color
    public let ink: Color
    public let subtle: Color
    public let linkVisited: Color
}

public extension SCChannel {
    static let now = SCChannel(
        name: "now",
        action: scDynamic(
            light: rgb(0.2119, 0.3574, 0.9211), // oklab(0.537 -0.011 -0.22)
            dark: rgb(0.6753, 0.7444, 0.9989) // oklab(0.811 0.004 -0.094)
        ),
        actionHover: scDynamic(
            light: rgb(0.1885, 0.3239, 0.8657), // oklab(0.507 -0.0107 -0.2134)
            dark: rgb(0.6136, 0.7134, 0.9586) // oklab(0.78 -0.0047 -0.094)
        ),
        actionPressed: scDynamic(
            light: rgb(0.1662, 0.2906, 0.8108), // oklab(0.477 -0.0103 -0.2068)
            dark: rgb(0.5776, 0.676, 0.9189) // oklab(0.75 -0.0047 -0.094)
        ),
        washStart: scDynamic(
            light: rgb(0.8943, 0.9339, 1), // oklab(0.947 -0.004 -0.025)
            dark: rgb(0.1486, 0.1778, 0.2498) // oklab(0.3 -0.0017 -0.035)
        ),
        washEnd: scDynamic(
            light: rgb(0.8121, 0.8657, 0.9841), // oklab(0.896 -0.003 -0.044)
            dark: rgb(0.1931, 0.2319, 0.3282) // oklab(0.355 -0.0022 -0.0449)
        ),
        ink: scDynamic(
            light: rgb(0.1178, 0.165, 0.3696), // oklab(0.307 0.0004 -0.094)
            dark: rgb(0.8738, 0.9091, 0.9912) // oklab(0.93 -0.0015 -0.03)
        ),
        subtle: scDynamic(
            light: rgb(0.8943, 0.9339, 1), // oklab(0.947 -0.004 -0.025)
            dark: rgb(0.1486, 0.1778, 0.2498) // oklab(0.3 -0.0017 -0.035)
        ),
        linkVisited: scDynamic(
            light: rgb(0.1178, 0.165, 0.3696), // oklab(0.307 0.0004 -0.094)
            dark: rgb(0.8738, 0.9091, 0.9912) // oklab(0.93 -0.0015 -0.03)
        )
    )
    static let transport = SCChannel(
        name: "transport",
        action: scDynamic(
            light: rgb(0.6499, 0.2401, 0.0126), // oklab(0.501 0.111 0.1)
            dark: rgb(0.9998, 0.7028, 0.5419) // oklab(0.83 0.068 0.079)
        ),
        actionHover: scDynamic(
            light: rgb(0.5982, 0.2174, 0.0077), // oklab(0.471 0.1047 0.0943)
            dark: rgb(0.9425, 0.6314, 0.5103) // oklab(0.78 0.0774 0.0698)
        ),
        actionPressed: scDynamic(
            light: rgb(0.5473, 0.1951, 0.0037), // oklab(0.441 0.0984 0.0886)
            dark: rgb(0.9025, 0.5945, 0.4745) // oklab(0.75 0.0774 0.0698)
        ),
        washStart: scDynamic(
            light: rgb(1, 0.9143, 0.8528), // oklab(0.948 0.017 0.027)
            dark: rgb(0.2393, 0.1568, 0.1249) // oklab(0.3 0.026 0.0234)
        ),
        washEnd: scDynamic(
            light: rgb(1, 0.8083, 0.7093), // oklab(0.888 0.043 0.049)
            dark: rgb(0.314, 0.2036, 0.1608) // oklab(0.355 0.0334 0.0301)
        ),
        ink: scDynamic(
            light: rgb(0.4163, 0.18, 0.0545), // oklab(0.379 0.068 0.068)
            dark: rgb(0.9825, 0.8859, 0.8492) // oklab(0.93 0.0223 0.0201)
        ),
        subtle: scDynamic(
            light: rgb(1, 0.9143, 0.8528), // oklab(0.948 0.017 0.027)
            dark: rgb(0.2393, 0.1568, 0.1249) // oklab(0.3 0.026 0.0234)
        ),
        linkVisited: scDynamic(
            light: rgb(0.4163, 0.18, 0.0545), // oklab(0.379 0.068 0.068)
            dark: rgb(0.9825, 0.8859, 0.8492) // oklab(0.93 0.0223 0.0201)
        )
    )
    static let visit = SCChannel(
        name: "visit",
        action: scDynamic(
            light: rgb(0.6903, 0.1318, 0.3102), // oklab(0.501 0.176 0.026)
            dark: rgb(0.9558, 0.6634, 0.7115) // oklab(0.81 0.088 0.013)
        ),
        actionHover: scDynamic(
            light: rgb(0.6421, 0.0987, 0.2807), // oklab(0.471 0.1707 0.0252)
            dark: rgb(0.9158, 0.6265, 0.6746) // oklab(0.78 0.088 0.013)
        ),
        actionPressed: scDynamic(
            light: rgb(0.5946, 0.0615, 0.2517), // oklab(0.441 0.1654 0.0244)
            dark: rgb(0.876, 0.5899, 0.638) // oklab(0.75 0.088 0.013)
        ),
        washStart: scDynamic(
            light: rgb(0.9831, 0.9018, 0.8952), // oklab(0.941 0.021 0.009)
            dark: rgb(0.2402, 0.1507, 0.1657) // oklab(0.3 0.0346 0.0051)
        ),
        washEnd: scDynamic(
            light: rgb(0.9564, 0.7964, 0.7761), // oklab(0.876 0.042 0.021)
            dark: rgb(0.3152, 0.1954, 0.2158) // oklab(0.355 0.0445 0.0066)
        ),
        ink: scDynamic(
            light: rgb(0.369, 0.1212, 0.1562), // oklab(0.339 0.089 0.024)
            dark: rgb(0.9845, 0.8788, 0.8931) // oklab(0.93 0.0297 0.0044)
        ),
        subtle: scDynamic(
            light: rgb(0.9831, 0.9018, 0.8952), // oklab(0.941 0.021 0.009)
            dark: rgb(0.2402, 0.1507, 0.1657) // oklab(0.3 0.0346 0.0051)
        ),
        linkVisited: scDynamic(
            light: rgb(0.369, 0.1212, 0.1562), // oklab(0.339 0.089 0.024)
            dark: rgb(0.9845, 0.8788, 0.8931) // oklab(0.93 0.0297 0.0044)
        )
    )
    static let justice = SCChannel(
        name: "justice",
        action: scDynamic(
            light: rgb(0.3995, 0.2505, 0.7841), // oklab(0.495 0.068 -0.187)
            dark: rgb(0.7511, 0.7147, 0.993) // oklab(0.81 0.034 -0.0935)
        ),
        actionHover: scDynamic(
            light: rgb(0.367, 0.2191, 0.7327), // oklab(0.465 0.066 -0.1814)
            dark: rgb(0.714, 0.6773, 0.9531) // oklab(0.78 0.034 -0.0935)
        ),
        actionPressed: scDynamic(
            light: rgb(0.3349, 0.1878, 0.682), // oklab(0.435 0.0639 -0.1758)
            dark: rgb(0.6773, 0.6403, 0.9135) // oklab(0.75 0.034 -0.0935)
        ),
        washStart: scDynamic(
            light: rgb(0.9368, 0.9064, 0.9809), // oklab(0.94 0.015 -0.022)
            dark: rgb(0.178, 0.1681, 0.2445) // oklab(0.3 0.012 -0.0329)
        ),
        washEnd: scDynamic(
            light: rgb(0.8631, 0.8113, 0.9519), // oklab(0.876 0.027 -0.043)
            dark: rgb(0.2325, 0.2189, 0.3213) // oklab(0.355 0.0154 -0.0423)
        ),
        ink: scDynamic(
            light: rgb(0.2343, 0.1651, 0.3988), // oklab(0.339 0.041 -0.092)
            dark: rgb(0.9059, 0.8978, 0.9851) // oklab(0.93 0.0103 -0.0282)
        ),
        subtle: scDynamic(
            light: rgb(0.9368, 0.9064, 0.9809), // oklab(0.94 0.015 -0.022)
            dark: rgb(0.178, 0.1681, 0.2445) // oklab(0.3 0.012 -0.0329)
        ),
        linkVisited: scDynamic(
            light: rgb(0.2343, 0.1651, 0.3988), // oklab(0.339 0.041 -0.092)
            dark: rgb(0.9059, 0.8978, 0.9851) // oklab(0.93 0.0103 -0.0282)
        )
    )
    static let build = SCChannel(
        name: "build",
        action: scDynamic(
            light: rgb(0.541, 0.3255, 0.0053), // oklab(0.494 0.043 0.1)
            dark: rgb(0.853, 0.7323, 0.6123) // oklab(0.81 0.0215 0.05)
        ),
        actionHover: scDynamic(
            light: rgb(0.4952, 0.2973, 0.0104), // oklab(0.464 0.0401 0.0933)
            dark: rgb(0.8146, 0.695, 0.576) // oklab(0.78 0.0215 0.05)
        ),
        actionPressed: scDynamic(
            light: rgb(0.4504, 0.2695, 0.0132), // oklab(0.434 0.0373 0.0867)
            dark: rgb(0.7765, 0.6581, 0.5401) // oklab(0.75 0.0215 0.05)
        ),
        washStart: scDynamic(
            light: rgb(1, 0.9414, 0.8629), // oklab(0.962 0.008 0.03)
            dark: rgb(0.2267, 0.1662, 0.1036) // oklab(0.3 0.0138 0.0322)
        ),
        washEnd: scDynamic(
            light: rgb(0.983, 0.8668, 0.7218), // oklab(0.913 0.017 0.056)
            dark: rgb(0.2974, 0.2162, 0.1316) // oklab(0.355 0.0178 0.0413)
        ),
        ink: scDynamic(
            light: rgb(0.3528, 0.2274, 0.0716), // oklab(0.378 0.026 0.065)
            dark: rgb(0.9655, 0.8961, 0.8286) // oklab(0.93 0.0119 0.0276)
        ),
        subtle: scDynamic(
            light: rgb(1, 0.9414, 0.8629), // oklab(0.962 0.008 0.03)
            dark: rgb(0.2267, 0.1662, 0.1036) // oklab(0.3 0.0138 0.0322)
        ),
        linkVisited: scDynamic(
            light: rgb(0.3528, 0.2274, 0.0716), // oklab(0.378 0.026 0.065)
            dark: rgb(0.9655, 0.8961, 0.8286) // oklab(0.93 0.0119 0.0276)
        )
    )
    static let invest = SCChannel(
        name: "invest",
        action: scDynamic(
            light: rgb(0.1505, 0.4748, 0.2683), // oklab(0.513 -0.101 0.054)
            dark: rgb(0.652, 0.8004, 0.686) // oklab(0.81 -0.0505 0.027)
        ),
        actionHover: scDynamic(
            light: rgb(0.1214, 0.4381, 0.2404), // oklab(0.483 -0.098 0.0524)
            dark: rgb(0.6153, 0.7625, 0.6492) // oklab(0.78 -0.0505 0.027)
        ),
        actionPressed: scDynamic(
            light: rgb(0.0918, 0.4018, 0.2129), // oklab(0.453 -0.0949 0.0508)
            dark: rgb(0.5789, 0.725, 0.6128) // oklab(0.75 -0.0505 0.027)
        ),
        washStart: scDynamic(
            light: rgb(0.8899, 0.959, 0.9054), // oklab(0.952 -0.023 0.012)
            dark: rgb(0.1265, 0.1999, 0.1453) // oklab(0.3 -0.0309 0.0165)
        ),
        washEnd: scDynamic(
            light: rgb(0.7833, 0.9029, 0.8109), // oklab(0.897 -0.04 0.021)
            dark: rgb(0.1623, 0.2615, 0.1885) // oklab(0.355 -0.0397 0.0212)
        ),
        ink: scDynamic(
            light: rgb(0.1305, 0.2864, 0.1782), // oklab(0.368 -0.058 0.031)
            dark: rgb(0.8545, 0.9335, 0.8714) // oklab(0.93 -0.0265 0.0141)
        ),
        subtle: scDynamic(
            light: rgb(0.8899, 0.959, 0.9054), // oklab(0.952 -0.023 0.012)
            dark: rgb(0.1265, 0.1999, 0.1453) // oklab(0.3 -0.0309 0.0165)
        ),
        linkVisited: scDynamic(
            light: rgb(0.1305, 0.2864, 0.1782), // oklab(0.368 -0.058 0.031)
            dark: rgb(0.8545, 0.9335, 0.8714) // oklab(0.93 -0.0265 0.0141)
        )
    )
    static let trade = SCChannel(
        name: "trade",
        action: scDynamic(
            light: rgb(0.2383, 0.3333, 0.4269), // oklab(0.44 -0.018 -0.046)
            dark: rgb(0.6354, 0.7287, 0.8308) // oklab(0.779 -0.015 -0.043)
        ),
        actionHover: scDynamic(
            light: rgb(0.2098, 0.3008, 0.3899), // oklab(0.41 -0.0175 -0.0446)
            dark: rgb(0.6328, 0.7314, 0.8307) // oklab(0.78 -0.0166 -0.0424)
        ),
        actionPressed: scDynamic(
            light: rgb(0.1821, 0.2687, 0.3535), // oklab(0.38 -0.0169 -0.0432)
            dark: rgb(0.5965, 0.6942, 0.7925) // oklab(0.75 -0.0166 -0.0424)
        ),
        washStart: scDynamic(
            light: rgb(0.9167, 0.9457, 0.9723), // oklab(0.955 -0.005 -0.011)
            dark: rgb(0.1242, 0.1858, 0.246) // oklab(0.3 -0.0128 -0.0326)
        ),
        washEnd: scDynamic(
            light: rgb(0.8367, 0.8825, 0.9346), // oklab(0.905 -0.007 -0.021)
            dark: rgb(0.1596, 0.2425, 0.3234) // oklab(0.355 -0.0164 -0.0419)
        ),
        ink: scDynamic(
            light: rgb(0.1363, 0.2043, 0.2905), // oklab(0.321 -0.012 -0.044)
            dark: rgb(0.8511, 0.9182, 0.9866) // oklab(0.93 -0.0109 -0.0279)
        ),
        subtle: scDynamic(
            light: rgb(0.9167, 0.9457, 0.9723), // oklab(0.955 -0.005 -0.011)
            dark: rgb(0.1242, 0.1858, 0.246) // oklab(0.3 -0.0128 -0.0326)
        ),
        linkVisited: scDynamic(
            light: rgb(0.1363, 0.2043, 0.2905), // oklab(0.321 -0.012 -0.044)
            dark: rgb(0.8511, 0.9182, 0.9866) // oklab(0.93 -0.0109 -0.0279)
        )
    )
    static let all: [SCChannel] = [.now, .transport, .visit, .justice, .build, .invest, .trade]
}

// MARK: - Space, radius, size (points)

public enum SCSpace {
    public static let s0: CGFloat = 0
    public static let s2: CGFloat = 2
    public static let s4: CGFloat = 4
    public static let s6: CGFloat = 6
    public static let s8: CGFloat = 8
    public static let s12: CGFloat = 12
    public static let s16: CGFloat = 16
    public static let s20: CGFloat = 20
    public static let s24: CGFloat = 24
    public static let s32: CGFloat = 32
    public static let s40: CGFloat = 40
    public static let s48: CGFloat = 48
    public static let s56: CGFloat = 56
    public static let s64: CGFloat = 64
    public static let s80: CGFloat = 80
    public static let s96: CGFloat = 96
    public static let s128: CGFloat = 128
}

public enum SCRadius {
    public static let xs: CGFloat = 6
    public static let s: CGFloat = 10
    /// Inputs and selects
    public static let field: CGFloat = 14
    /// Cards and list groups
    public static let card: CGFloat = 20
    /// Large panels, hero cards
    public static let panel: CGFloat = 24
    /// Bottom sheets, dialogs
    public static let sheet: CGFloat = 28
    /// 44px glass controls
    public static let control: CGFloat = 22
    /// Buttons, chips, search
    public static let pill: CGFloat = 999
}

public enum SCSize {
    /// Minimum interactive target
    public static let targetMin: CGFloat = 44
    public static let controlM: CGFloat = 44
    /// Primary buttons and fields
    public static let controlL: CGFloat = 54
    public static let iconS: CGFloat = 16
    public static let iconM: CGFloat = 20
    public static let iconL: CGFloat = 24
    /// Step progress track
    public static let progress: CGFloat = 8
    /// Max width of running text
    public static let measure: CGFloat = 680
    public static let focusRing: CGFloat = 3
    public static let focusOffset: CGFloat = 2
    /// Dividers
    public static let borderHairline: CGFloat = 1
    /// Field and control boundaries
    public static let borderControl: CGFloat = 1.5
    /// Selected and error boundaries
    public static let borderStrong: CGFloat = 2
    /// Error bar on the start side of a field
    public static let borderAccent: CGFloat = 3
}

// MARK: - Typography

/// A type role. Line height is the authored px value; SwiftUI has no line-height
/// property, so `scTextStyle` approximates it with lineSpacing.
public struct SCTextStyle: Sendable {
    public let postScriptName: String
    public let size: CGFloat
    public let lineHeight: CGFloat
    /// Letter spacing in points (always 0 for Arabic).
    public let tracking: CGFloat
    public let relativeTo: Font.TextStyle

    public var font: Font { Font.custom(postScriptName, size: size, relativeTo: relativeTo) }
}

public enum SCType {
    public enum Latin {
        /// Home hero
        public static let displayXl = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 80, lineHeight: 82, tracking: -1.6, relativeTo: .largeTitle)
        public static let displayL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 48, lineHeight: 50, tracking: -0.72, relativeTo: .largeTitle)
        public static let headingXl = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 34, lineHeight: 38, tracking: -0.34, relativeTo: .title)
        public static let headingL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 30, lineHeight: 34, tracking: -0.3, relativeTo: .title)
        public static let headingM = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 24, lineHeight: 28, tracking: 0, relativeTo: .title)
        public static let titleL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 22, lineHeight: 27, tracking: 0, relativeTo: .headline)
        public static let titleM = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 20, lineHeight: 24, tracking: 0, relativeTo: .headline)
        /// Buttons, links, row titles
        public static let titleS = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 17, lineHeight: 21, tracking: 0, relativeTo: .headline)
        public static let bodyL = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 19, lineHeight: 27, tracking: 0, relativeTo: .body)
        public static let bodyM = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 17, lineHeight: 24, tracking: 0, relativeTo: .body)
        public static let bodyS = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 15, lineHeight: 21, tracking: 0, relativeTo: .body)
        public static let labelM = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 15, lineHeight: 19, tracking: 0, relativeTo: .subheadline)
        /// Tags and chips
        public static let labelS = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 14, lineHeight: 17, tracking: 0, relativeTo: .subheadline)
        /// +1px from D+ (13/16)
        public static let eyebrow = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 14, lineHeight: 17, tracking: 0, relativeTo: .caption)
        /// +1px from D+ (13/18)
        public static let caption = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 14, lineHeight: 19, tracking: 0, relativeTo: .caption)
        /// +1px from D+ (12/15); smallest allowed
        public static let captionS = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 13, lineHeight: 16, tracking: 0, relativeTo: .caption)
        /// Answers in summary lists
        public static let value = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 17, lineHeight: 22, tracking: 0, relativeTo: .body)
        /// Field hints
        public static let hint = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 15, lineHeight: 21, tracking: 0, relativeTo: .caption)
        /// Field error messages
        public static let error = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 15, lineHeight: 21, tracking: 0, relativeTo: .footnote)
        /// Amounts
        public static let numeralL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 34, lineHeight: 38, tracking: -0.34, relativeTo: .title)
    }
    public enum Arabic {
        public static let displayL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 50, lineHeight: 62, tracking: 0, relativeTo: .largeTitle)
        public static let headingL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 30, lineHeight: 38, tracking: 0, relativeTo: .title)
        public static let headingM = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 26, lineHeight: 34, tracking: 0, relativeTo: .title)
        /// Buttons; +1px from D+ (18/24)
        public static let titleS = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 19, lineHeight: 25, tracking: 0, relativeTo: .headline)
        public static let bodyL = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 20, lineHeight: 31, tracking: 0, relativeTo: .body)
        public static let bodyM = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 19, lineHeight: 29, tracking: 0, relativeTo: .body)
        public static let bodyS = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 18, lineHeight: 28, tracking: 0, relativeTo: .body)
        /// Field labels; +1px from D+ (17/22)
        public static let labelM = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 18, lineHeight: 23, tracking: 0, relativeTo: .subheadline)
        /// +1px from D+ (16/24-25)
        public static let hint = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 17, lineHeight: 26, tracking: 0, relativeTo: .caption)
        /// +1px from D+ (17/26)
        public static let error = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 18, lineHeight: 27, tracking: 0, relativeTo: .footnote)
        /// Smallest Arabic size
        public static let caption = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 16, lineHeight: 24, tracking: 0, relativeTo: .caption)
        public static let displayXl = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 84, lineHeight: 100, tracking: 0, relativeTo: .largeTitle)
        public static let headingXl = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 36, lineHeight: 46, tracking: 0, relativeTo: .title)
        public static let titleL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 24, lineHeight: 32, tracking: 0, relativeTo: .headline)
        public static let titleM = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 22, lineHeight: 29, tracking: 0, relativeTo: .headline)
        /// Tags and chips
        public static let labelS = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 16, lineHeight: 21, tracking: 0, relativeTo: .subheadline)
        public static let eyebrow = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 16, lineHeight: 21, tracking: 0, relativeTo: .caption)
        /// Same as caption: Arabic never goes below 16px
        public static let captionS = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 16, lineHeight: 24, tracking: 0, relativeTo: .caption)
        /// Answers in summary lists
        public static let value = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 19, lineHeight: 26, tracking: 0, relativeTo: .body)
        /// Amounts; digits stay Latin
        public static let numeralL = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 34, lineHeight: 40, tracking: 0, relativeTo: .title)
    }
}

public extension Font {
    static let scDisplayXl = SCType.Latin.displayXl.font
    static let scDisplayL = SCType.Latin.displayL.font
    static let scHeadingXl = SCType.Latin.headingXl.font
    static let scHeadingL = SCType.Latin.headingL.font
    static let scHeadingM = SCType.Latin.headingM.font
    static let scTitleL = SCType.Latin.titleL.font
    static let scTitleM = SCType.Latin.titleM.font
    static let scTitleS = SCType.Latin.titleS.font
    static let scBodyL = SCType.Latin.bodyL.font
    static let scBodyM = SCType.Latin.bodyM.font
    static let scBodyS = SCType.Latin.bodyS.font
    static let scLabelM = SCType.Latin.labelM.font
    static let scLabelS = SCType.Latin.labelS.font
    static let scEyebrow = SCType.Latin.eyebrow.font
    static let scCaption = SCType.Latin.caption.font
    static let scCaptionS = SCType.Latin.captionS.font
    static let scValue = SCType.Latin.value.font
    static let scHint = SCType.Latin.hint.font
    static let scError = SCType.Latin.error.font
    static let scNumeralL = SCType.Latin.numeralL.font
    static let scArDisplayL = SCType.Arabic.displayL.font
    static let scArHeadingL = SCType.Arabic.headingL.font
    static let scArHeadingM = SCType.Arabic.headingM.font
    static let scArTitleS = SCType.Arabic.titleS.font
    static let scArBodyL = SCType.Arabic.bodyL.font
    static let scArBodyM = SCType.Arabic.bodyM.font
    static let scArBodyS = SCType.Arabic.bodyS.font
    static let scArLabelM = SCType.Arabic.labelM.font
    static let scArHint = SCType.Arabic.hint.font
    static let scArError = SCType.Arabic.error.font
    static let scArCaption = SCType.Arabic.caption.font
    static let scArDisplayXl = SCType.Arabic.displayXl.font
    static let scArHeadingXl = SCType.Arabic.headingXl.font
    static let scArTitleL = SCType.Arabic.titleL.font
    static let scArTitleM = SCType.Arabic.titleM.font
    static let scArLabelS = SCType.Arabic.labelS.font
    static let scArEyebrow = SCType.Arabic.eyebrow.font
    static let scArCaptionS = SCType.Arabic.captionS.font
    static let scArValue = SCType.Arabic.value.font
    static let scArNumeralL = SCType.Arabic.numeralL.font
}

public extension View {
    /// Applies font, tracking and an approximation of the authored line height.
    func scTextStyle(_ style: SCTextStyle) -> some View {
        let natural = UIFont(name: style.postScriptName, size: style.size)?.lineHeight ?? style.size
        return self
            .font(style.font)
            .tracking(style.tracking)
            .lineSpacing(max(0, style.lineHeight - natural))
    }
}

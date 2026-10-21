// Generated — edit tokens/source/*.json or tokens/*.json, then npm run build
// Colours are converted from OKLAB to sRGB with the maths in scripts/lib/oklab.mjs.
// The source OKLAB value is in the comment beside each component set.

import SwiftUI
import UIKit

private func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ a: CGFloat = 1) -> UIColor {
    UIColor(red: r, green: g, blue: b, alpha: a)
}

private func scDynamic(light: UIColor, dark: UIColor) -> Color {
    Color(UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })
}

// MARK: - Colour roles

public extension Color {
    /// Page background
    static let scSurface = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Cards, fields, list groups, dialogs and sheets
    static let scSurfaceCard = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1212, 0.1234, 0.1315) // oklab(0.2415 0.0003 -0.004)
    )
    /// Bands, panels, table headers, totals rows
    static let scSurfaceContainer = scDynamic(
        light: rgb(0.9515, 0.9545, 0.9661), // oklab(0.9656 0.0003 -0.004)
        dark: rgb(0.1618, 0.1641, 0.1725) // oklab(0.2846 0.0003 -0.004)
    )
    /// A container nested in a container; skeletons
    static let scSurfaceContainerHigh = scDynamic(
        light: rgb(0.929, 0.9321, 0.9436), // oklab(0.9484 0.0003 -0.004)
        dark: rgb(0.204, 0.2063, 0.2151) // oklab(0.3277 0.0003 -0.004)
    )
    /// Primary text and icons
    static let scOnSurface = scDynamic(
        light: rgb(0.1054, 0.1075, 0.1155), // oklab(0.2242 0.0003 -0.004)
        dark: rgb(1, 1, 1) // oklab(1 0 0)
    )
    /// Secondary text: hints, captions, metadata
    static let scOnSurfaceVariant = scDynamic(
        light: rgb(0.3669, 0.3694, 0.3791), // oklab(0.4829 0.0003 -0.004)
        dark: rgb(0.7747, 0.7776, 0.7887) // oklab(0.8277 0.0003 -0.004)
    )
    /// Control boundaries (1.5px) and inactive markers; at least 3:1
    static let scOutline = scDynamic(
        light: rgb(0.3669, 0.3694, 0.3791), // oklab(0.4829 0.0003 -0.004)
        dark: rgb(0.564, 0.5667, 0.5772) // oklab(0.6553 0.0003 -0.004)
    )
    /// Hovered control edges, the sign-in edge and the plate chip; at least 3:1
    static let scOutlineStrong = scDynamic(
        light: rgb(0.1054, 0.1075, 0.1155), // oklab(0.2242 0.0003 -0.004)
        dark: rgb(0.8844, 0.8874, 0.8988) // oklab(0.9139 0.0003 -0.004)
    )
    /// Dividers and card edges only; never the only edge of a control
    static let scOutlineVariant = scDynamic(
        light: rgb(0.8844, 0.8874, 0.8988), // oklab(0.9139 0.0003 -0.004)
        dark: rgb(0.2212, 0.2236, 0.2325) // oklab(0.3449 0.0003 -0.004)
    )
    /// Tooltips and toasts
    static let scInverseSurface = scDynamic(
        light: rgb(0.1869, 0.1892, 0.1979), // oklab(0.3104 0.0003 -0.004)
        dark: rgb(0.8844, 0.8874, 0.8988) // oklab(0.9139 0.0003 -0.004)
    )
    /// Text on inverse-surface
    static let scInverseOnSurface = scDynamic(
        light: rgb(0.9515, 0.9545, 0.9661), // oklab(0.9656 0.0003 -0.004)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Fill of a disabled control
    static let scDisabledContainer = scDynamic(
        light: rgb(0.929, 0.9321, 0.9436), // oklab(0.9484 0.0003 -0.004)
        dark: rgb(0.1869, 0.1892, 0.1979) // oklab(0.3104 0.0003 -0.004)
    )
    /// Text, icons and edges of a disabled control
    static let scOnDisabled = scDynamic(
        light: rgb(0.4635, 0.4662, 0.4763), // oklab(0.5691 0.0003 -0.004)
        dark: rgb(0.564, 0.5667, 0.5772) // oklab(0.6553 0.0003 -0.004)
    )
    /// The 3px focus ring, drawn outside a 2px gap of surface
    static let scFocusRing = scDynamic(
        light: rgb(0.1054, 0.1075, 0.1155), // oklab(0.2242 0.0003 -0.004)
        dark: rgb(1, 1, 1) // oklab(1 0 0)
    )
    /// City indigo: the network strip, sign-in and Dubai Pay hand-offs
    static let scPrimary = scDynamic(
        light: rgb(0.2191, 0.2515, 0.5249), // oklab(0.4037 0.0099 -0.1152)
        dark: rgb(0.7183, 0.7681, 0.9976) // oklab(0.8306 0.0072 -0.0832)
    )
    /// Text and icons on primary
    static let scOnPrimary = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Primary fill on pointer hover
    static let scPrimaryHover = scDynamic(
        light: rgb(0.1869, 0.2156, 0.4201), // oklab(0.3585 0.0077 -0.0896)
        dark: rgb(0.6569, 0.7115, 0.973) // oklab(0.7882 0.0082 -0.096)
    )
    /// Primary fill while pressed
    static let scPrimaryPressed = scDynamic(
        light: rgb(0.159, 0.1814, 0.3068), // oklab(0.3131 0.0049 -0.0576)
        dark: rgb(0.5971, 0.655, 0.9478) // oklab(0.7459 0.0093 -0.1088)
    )
    /// Selected or emphasised indigo container
    static let scPrimaryContainer = scDynamic(
        light: rgb(0.8584, 0.8845, 0.9934), // oklab(0.9149 0.0033 -0.0384)
        dark: rgb(0.2191, 0.2515, 0.5249) // oklab(0.4037 0.0099 -0.1152)
    )
    /// Text and icons on primary-container
    static let scOnPrimaryContainer = scDynamic(
        light: rgb(0.2191, 0.2515, 0.5249), // oklab(0.4037 0.0099 -0.1152)
        dark: rgb(0.8584, 0.8845, 0.9934) // oklab(0.9149 0.0033 -0.0384)
    )
    /// Quiet indigo band or tint
    static let scPrimarySubtle = scDynamic(
        light: rgb(0.9284, 0.9422, 0.9975), // oklab(0.9574 0.0016 -0.0192)
        dark: rgb(0.159, 0.1814, 0.3068) // oklab(0.3131 0.0049 -0.0576)
    )
    /// Error text, icons, field edges and destructive fills
    static let scError = scDynamic(
        light: rgb(0.7534, 0.0016, 0.0411), // oklab(0.508 0.183 0.098)
        dark: rgb(1, 0.7051, 0.6629) // oklab(0.8375 0.0791 0.0424)
    )
    /// Text and icons on an error fill
    static let scOnError = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Destructive fill on pointer hover
    static let scErrorHover = scDynamic(
        light: rgb(0.6637, 0.0034, 0.0324), // oklab(0.4626 0.1664 0.0891)
        dark: rgb(0.9996, 0.6253, 0.5752) // oklab(0.7975 0.1024 0.0548)
    )
    /// Destructive fill while pressed
    static let scErrorPressed = scDynamic(
        light: rgb(0.5774, 0.0002, 0.0221), // oklab(0.4173 0.1504 0.0806)
        dark: rgb(0.9994, 0.5399, 0.484) // oklab(0.7578 0.1275 0.0683)
    )
    /// Error summary, error chip and callout background
    static let scErrorContainer = scDynamic(
        light: rgb(0.9999, 0.9285, 0.9173), // oklab(0.9591 0.0178 0.0096)
        dark: rgb(0.3513, 0.1056, 0.0851) // oklab(0.3213 0.0823 0.0441)
    )
    /// Strong text on error-container
    static let scOnErrorContainer = scDynamic(
        light: rgb(0.5774, 0.0002, 0.0221), // oklab(0.4173 0.1504 0.0806)
        dark: rgb(1, 0.8558, 0.8337) // oklab(0.9183 0.0369 0.0198)
    )
    /// Success text and icons; completed step markers
    static let scSuccess = scDynamic(
        light: rgb(0.0441, 0.4283, 0.1784), // oklab(0.4691 -0.11 0.067)
        dark: rgb(0.6203, 0.8279, 0.6501) // oklab(0.8182 -0.0715 0.0436)
    )
    /// Text and icons on a success fill
    static let scOnSuccess = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Success chip and callout background
    static let scSuccessContainer = scDynamic(
        light: rgb(0.8725, 0.9688, 0.8838), // oklab(0.9525 -0.033 0.0201)
        dark: rgb(0.0924, 0.2146, 0.1171) // oklab(0.304 -0.0495 0.0302)
    )
    /// Strong text on success-container
    static let scOnSuccessContainer = scDynamic(
        light: rgb(0.0014, 0.3242, 0.1209), // oklab(0.385 -0.0934 0.0569)
        dark: rgb(0.8173, 0.9126, 0.8285) // oklab(0.9094 -0.033 0.0201)
    )
    /// Warning text and icons
    static let scWarning = scDynamic(
        light: rgb(0.5152, 0.3308, 0.0036), // oklab(0.4878 0.032 0.099)
        dark: rgb(0.8908, 0.7564, 0.5932) // oklab(0.83 0.0208 0.0643)
    )
    /// Text and icons on a warning fill
    static let scOnWarning = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Warning chip and callout background
    static let scWarningContainer = scDynamic(
        light: rgb(0.9952, 0.9351, 0.8642), // oklab(0.9578 0.009 0.0277)
        dark: rgb(0.2491, 0.1757, 0.0796) // oklab(0.3123 0.0144 0.0445)
    )
    /// Strong text on warning-container
    static let scOnWarningContainer = scDynamic(
        light: rgb(0.3913, 0.2465, 0), // oklab(0.4007 0.0264 0.0816)
        dark: rgb(0.9421, 0.8785, 0.8032) // oklab(0.9147 0.0096 0.0297)
    )
    /// Information text and icons
    static let scInfo = scDynamic(
        light: rgb(0.1659, 0.3662, 0.6616), // oklab(0.4856 -0.027 -0.13)
        dark: rgb(0.6437, 0.7864, 0.9995) // oklab(0.8275 -0.0176 -0.0845)
    )
    /// Text and icons on an info fill
    static let scOnInfo = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Information chip and callout background
    static let scInfoContainer = scDynamic(
        light: rgb(0.9124, 0.9468, 0.998), // oklab(0.9567 -0.0041 -0.0195)
        dark: rgb(0.1131, 0.1911, 0.3078) // oklab(0.311 -0.0122 -0.0585)
    )
    /// Strong text on info-container
    static let scOnInfoContainer = scDynamic(
        light: rgb(0.0963, 0.2721, 0.5271), // oklab(0.3996 -0.0243 -0.117)
        dark: rgb(0.8258, 0.8935, 0.9944) // oklab(0.9135 -0.0081 -0.039)
    )
    /// Decorative tile background
    static let scTintBlue = scDynamic(
        light: rgb(0.9111, 0.947, 1), // oklab(0.9567 -0.0043 -0.0202)
        dark: rgb(0.1079, 0.1909, 0.3141) // oklab(0.3111 -0.013 -0.0617)
    )
    /// Icon and short text on the tile
    static let scOnTintBlue = scDynamic(
        light: rgb(0.1479, 0.3649, 0.6772), // oklab(0.486 -0.029 -0.137)
        dark: rgb(0.6429, 0.7867, 0.9995) // oklab(0.8275 -0.0179 -0.0845)
    )
    /// Decorative tile background
    static let scTintViolet = scDynamic(
        light: rgb(0.9536, 0.935, 0.995), // oklab(0.9585 0.0105 -0.0181)
        dark: rgb(0.2155, 0.1641, 0.3017) // oklab(0.3163 0.0315 -0.0544)
    )
    /// Icon and short text on the tile
    static let scOnTintViolet = scDynamic(
        light: rgb(0.4382, 0.2964, 0.6467), // oklab(0.4972 0.07 -0.121)
        dark: rgb(0.8229, 0.7374, 0.988) // oklab(0.8353 0.0455 -0.0786)
    )
    /// Decorative tile background
    static let scTintRose = scDynamic(
        light: rgb(0.9998, 0.927, 0.9328), // oklab(0.9594 0.0198 0.0042)
        dark: rgb(0.3029, 0.1394, 0.1638) // oklab(0.3182 0.0617 0.013)
    )
    /// Icon and short text on the tile
    static let scOnTintRose = scDynamic(
        light: rgb(0.6388, 0.2236, 0.3052), // oklab(0.5005 0.137 0.029)
        dark: rgb(0.9997, 0.6984, 0.7314) // oklab(0.8388 0.0883 0.0187)
    )
    /// Decorative tile background
    static let scTintOrange = scDynamic(
        light: rgb(0.98, 0.9355, 0.9103), // oklab(0.9579 0.0093 0.0118)
        dark: rgb(0.2649, 0.1668, 0.1069) // oklab(0.3139 0.0279 0.0355)
    )
    /// Icon and short text on the tile
    static let scOnTintOrange = scDynamic(
        light: rgb(0.5515, 0.307, 0.1436), // oklab(0.4912 0.062 0.079)
        dark: rgb(0.9233, 0.7408, 0.6341) // oklab(0.8325 0.0403 0.0513)
    )
    /// Decorative tile background
    static let scTintAmber = scDynamic(
        light: rgb(0.9622, 0.9416, 0.9053), // oklab(0.957 0.0019 0.0134)
        dark: rgb(0.2311, 0.1826, 0.0927) // oklab(0.3112 0.0058 0.0401)
    )
    /// Icon and short text on the tile
    static let scOnTintAmber = scDynamic(
        light: rgb(0.4723, 0.3496, 0.0889), // oklab(0.4851 0.013 0.089)
        dark: rgb(0.8555, 0.7675, 0.6121) // oklab(0.8284 0.0084 0.0579)
    )
    /// Decorative tile background
    static let scTintGreen = scDynamic(
        light: rgb(0.9117, 0.9564, 0.9057), // oklab(0.9547 -0.0165 0.0129)
        dark: rgb(0.1048, 0.2141, 0.0938) // oklab(0.3041 -0.0495 0.0387)
    )
    /// Icon and short text on the tile
    static let scOnTintGreen = scDynamic(
        light: rgb(0.121, 0.4267, 0.0948), // oklab(0.4695 -0.11 0.086)
        dark: rgb(0.6362, 0.8272, 0.6133) // oklab(0.8182 -0.0715 0.0559)
    )
    /// Text and icons on any channel action fill (the same in every channel)
    static let scChannelOnAction = scDynamic(
        light: rgb(1, 1, 1), // oklab(1 0 0)
        dark: rgb(0.1054, 0.1075, 0.1155) // oklab(0.2242 0.0003 -0.004)
    )
    /// Behind modal dialogs and sheets
    static let scScrim = scDynamic(
        light: rgb(0, 0, 0, 0.5), // oklab(0 0 0 / 0.5)
        dark: rgb(0, 0, 0, 0.64) // oklab(0 0 0 / 0.64)
    )
    /// Base shadow colour; elevation layers set their own alpha
    static let scShadow = scDynamic(
        light: rgb(0, 0, 0), // oklab(0 0 0)
        dark: rgb(0, 0, 0) // oklab(0 0 0)
    )
}

// MARK: - Channels

public struct SCChannel: Sendable {
    public let name: String
    public let action: Color
    public let actionHover: Color
    public let actionPressed: Color
    public let container: Color
    public let onContainer: Color
    public let subtle: Color
    public let outline: Color
    /// Text and icons on action, the same in every channel.
    public var onAction: Color { .scChannelOnAction }
}

public extension SCChannel {
    static let now = SCChannel(
        name: "now",
        action: scDynamic(
            light: rgb(0.1233, 0.3591, 0.7131), // oklab(0.4874 -0.03 -0.153)
            dark: rgb(0.6468, 0.7857, 0.9995) // oklab(0.8276 -0.0166 -0.0845)
        ),
        actionHover: scDynamic(
            light: rgb(0.0883, 0.3115, 0.6417), // oklab(0.4444 -0.0285 -0.1454)
            dark: rgb(0.5576, 0.7311, 0.9995) // oklab(0.785 -0.021 -0.1072)
        ),
        actionPressed: scDynamic(
            light: rgb(0.0522, 0.265, 0.5715), // oklab(0.4014 -0.027 -0.1377)
            dark: rgb(0.4676, 0.6756, 0.9984) // oklab(0.7427 -0.0255 -0.13)
        ),
        container: scDynamic(
            light: rgb(0.824, 0.8932, 0.9998), // oklab(0.9135 -0.008 -0.041)
            dark: rgb(0.0522, 0.265, 0.5715) // oklab(0.4014 -0.027 -0.1377)
        ),
        onContainer: scDynamic(
            light: rgb(0.0522, 0.265, 0.5715), // oklab(0.4014 -0.027 -0.1377)
            dark: rgb(0.824, 0.8932, 0.9998) // oklab(0.9135 -0.008 -0.041)
        ),
        subtle: scDynamic(
            light: rgb(0.9119, 0.9467, 0.9999), // oklab(0.9567 -0.004 -0.0202)
            dark: rgb(0.1, 0.1895, 0.3284) // oklab(0.3115 -0.0135 -0.0689)
        ),
        outline: scDynamic(
            light: rgb(0.6468, 0.7857, 0.9995), // oklab(0.8276 -0.0166 -0.0845)
            dark: rgb(0.1233, 0.3591, 0.7131) // oklab(0.4874 -0.03 -0.153)
        )
    )
    static let transport = SCChannel(
        name: "transport",
        action: scDynamic(
            light: rgb(0.6462, 0.2366, 0.0064), // oklab(0.4982 0.111 0.1)
            dark: rgb(1, 0.7107, 0.5985) // oklab(0.8364 0.0705 0.0636)
        ),
        actionHover: scDynamic(
            light: rgb(0.5703, 0.2034, 0.0004), // oklab(0.4539 0.1017 0.0916)
            dark: rgb(0.9779, 0.6421, 0.5113) // oklab(0.7951 0.0832 0.075)
        ),
        actionPressed: scDynamic(
            light: rgb(0.4943, 0.1724, 0.0012), // oklab(0.4094 0.0916 0.0825)
            dark: rgb(0.9498, 0.5748, 0.4273) // oklab(0.7536 0.0943 0.085)
        ),
        container: scDynamic(
            light: rgb(0.9999, 0.8585, 0.8044), // oklab(0.9177 0.033 0.0298)
            dark: rgb(0.4943, 0.1724, 0.0012) // oklab(0.4094 0.0916 0.0825)
        ),
        onContainer: scDynamic(
            light: rgb(0.4943, 0.1724, 0.0012), // oklab(0.4094 0.0916 0.0825)
            dark: rgb(0.9999, 0.8585, 0.8044) // oklab(0.9177 0.033 0.0298)
        ),
        subtle: scDynamic(
            light: rgb(1, 0.9299, 0.9033), // oklab(0.9588 0.016 0.0144)
            dark: rgb(0.3054, 0.1451, 0.0802) // oklab(0.317 0.0499 0.045)
        ),
        outline: scDynamic(
            light: rgb(1, 0.7107, 0.5985), // oklab(0.8364 0.0705 0.0636)
            dark: rgb(0.6462, 0.2366, 0.0064) // oklab(0.4982 0.111 0.1)
        )
    )
    static let visit = SCChannel(
        name: "visit",
        action: scDynamic(
            light: rgb(0.64, 0.2017, 0.4157), // oklab(0.5033 0.155 -0.016)
            dark: rgb(0.9997, 0.689, 0.8115) // oklab(0.8405 0.0993 -0.0102)
        ),
        actionHover: scDynamic(
            light: rgb(0.5722, 0.1618, 0.3656), // oklab(0.4592 0.1472 -0.0152)
            dark: rgb(0.9752, 0.6175, 0.763) // oklab(0.7996 0.1163 -0.012)
        ),
        actionPressed: scDynamic(
            light: rgb(0.5058, 0.1217, 0.3166), // oklab(0.4151 0.1395 -0.0144)
            dark: rgb(0.9463, 0.5471, 0.7145) // oklab(0.7586 0.1318 -0.0136)
        ),
        container: scDynamic(
            light: rgb(0.9999, 0.8487, 0.9039), // oklab(0.9198 0.0462 -0.0048)
            dark: rgb(0.5058, 0.1217, 0.3166) // oklab(0.4151 0.1395 -0.0144)
        ),
        onContainer: scDynamic(
            light: rgb(0.5058, 0.1217, 0.3166), // oklab(0.4151 0.1395 -0.0144)
            dark: rgb(0.9999, 0.8487, 0.9039) // oklab(0.9198 0.0462 -0.0048)
        ),
        subtle: scDynamic(
            light: rgb(0.9999, 0.925, 0.9514), // oklab(0.9598 0.0223 -0.0023)
            dark: rgb(0.3036, 0.1328, 0.208) // oklab(0.3195 0.0698 -0.0072)
        ),
        outline: scDynamic(
            light: rgb(0.9997, 0.689, 0.8115), // oklab(0.8405 0.0993 -0.0102)
            dark: rgb(0.64, 0.2017, 0.4157) // oklab(0.5033 0.155 -0.016)
        )
    )
    static let justice = SCChannel(
        name: "justice",
        action: scDynamic(
            light: rgb(0.4199, 0.3093, 0.6282), // oklab(0.4951 0.059 -0.113)
            dark: rgb(0.8091, 0.744, 0.9744) // oklab(0.8342 0.0383 -0.0735)
        ),
        actionHover: scDynamic(
            light: rgb(0.37, 0.2657, 0.5628), // oklab(0.4516 0.056 -0.1074)
            dark: rgb(0.7605, 0.6841, 0.9467) // oklab(0.7923 0.0442 -0.0848)
        ),
        actionPressed: scDynamic(
            light: rgb(0.3213, 0.2229, 0.4984), // oklab(0.408 0.0531 -0.1017)
            dark: rgb(0.7128, 0.6244, 0.9187) // oklab(0.7505 0.0501 -0.0961)
        ),
        container: scDynamic(
            light: rgb(0.9014, 0.873, 0.9821), // oklab(0.9166 0.0177 -0.0339)
            dark: rgb(0.3213, 0.2229, 0.4984) // oklab(0.408 0.0531 -0.1017)
        ),
        onContainer: scDynamic(
            light: rgb(0.3213, 0.2229, 0.4984), // oklab(0.408 0.0531 -0.1017)
            dark: rgb(0.9014, 0.873, 0.9821) // oklab(0.9166 0.0177 -0.0339)
        ),
        subtle: scDynamic(
            light: rgb(0.9502, 0.9364, 0.9918), // oklab(0.9583 0.0088 -0.017)
            dark: rgb(0.208, 0.1683, 0.2944) // oklab(0.3154 0.0265 -0.0509)
        ),
        outline: scDynamic(
            light: rgb(0.8091, 0.744, 0.9744), // oklab(0.8342 0.0383 -0.0735)
            dark: rgb(0.4199, 0.3093, 0.6282) // oklab(0.4951 0.059 -0.113)
        )
    )
    static let build = SCChannel(
        name: "build",
        action: scDynamic(
            light: rgb(0.4771, 0.3489, 0.0002), // oklab(0.4851 0.011 0.099)
            dark: rgb(0.9531, 0.7475, 0.2998) // oklab(0.8304 0.0156 0.1406)
        ),
        actionHover: scDynamic(
            light: rgb(0.4183, 0.3044, 0.0015), // oklab(0.4418 0.01 0.09)
            dark: rgb(0.8703, 0.7001, 0.3458) // oklab(0.7866 0.0132 0.1188)
        ),
        actionPressed: scDynamic(
            light: rgb(0.361, 0.2608, 0.0001), // oklab(0.3984 0.009 0.0813)
            dark: rgb(0.7737, 0.6562, 0.4243) // oklab(0.7426 0.0094 0.0842)
        ),
        container: scDynamic(
            light: rgb(0.9999, 0.8728, 0.6252), // oklab(0.9149 0.0097 0.0871)
            dark: rgb(0.361, 0.2608, 0.0001) // oklab(0.3984 0.009 0.0813)
        ),
        onContainer: scDynamic(
            light: rgb(0.361, 0.2608, 0.0001), // oklab(0.3984 0.009 0.0813)
            dark: rgb(0.9999, 0.8728, 0.6252) // oklab(0.9149 0.0097 0.0871)
        ),
        subtle: scDynamic(
            light: rgb(0.9915, 0.9386, 0.8375), // oklab(0.9571 0.0041 0.0366)
            dark: rgb(0.2331, 0.1824, 0.0787) // oklab(0.3111 0.005 0.0446)
        ),
        outline: scDynamic(
            light: rgb(0.9531, 0.7475, 0.2998), // oklab(0.8304 0.0156 0.1406)
            dark: rgb(0.4771, 0.3489, 0.0002) // oklab(0.4851 0.011 0.099)
        )
    )
    static let invest = SCChannel(
        name: "invest",
        action: scDynamic(
            light: rgb(0.1827, 0.4195, 0.153), // oklab(0.4713 -0.093 0.074)
            dark: rgb(0.5684, 0.8455, 0.5305) // oklab(0.8145 -0.1023 0.0814)
        ),
        actionHover: scDynamic(
            light: rgb(0.1461, 0.3686, 0.1179), // oklab(0.4288 -0.0883 0.0703)
            dark: rgb(0.5266, 0.7876, 0.4908) // oklab(0.772 -0.0976 0.0777)
        ),
        actionPressed: scDynamic(
            light: rgb(0.1094, 0.319, 0.083), // oklab(0.3864 -0.0837 0.0666)
            dark: rgb(0.5168, 0.7227, 0.4878) // oklab(0.7312 -0.079 0.0629)
        ),
        container: scDynamic(
            light: rgb(0.7627, 0.9333, 0.7376), // oklab(0.9055 -0.0632 0.0503)
            dark: rgb(0.1094, 0.319, 0.083) // oklab(0.3864 -0.0837 0.0666)
        ),
        onContainer: scDynamic(
            light: rgb(0.1094, 0.319, 0.083), // oklab(0.3864 -0.0837 0.0666)
            dark: rgb(0.7627, 0.9333, 0.7376) // oklab(0.9055 -0.0632 0.0503)
        ),
        subtle: scDynamic(
            light: rgb(0.8858, 0.9663, 0.8735), // oklab(0.9529 -0.0298 0.0237)
            dark: rgb(0.1214, 0.2107, 0.1093) // oklab(0.305 -0.0418 0.0333)
        ),
        outline: scDynamic(
            light: rgb(0.5684, 0.8455, 0.5305), // oklab(0.8145 -0.1023 0.0814)
            dark: rgb(0.1827, 0.4195, 0.153) // oklab(0.4713 -0.093 0.074)
        )
    )
    static let trade = SCChannel(
        name: "trade",
        action: scDynamic(
            light: rgb(0.2416, 0.3315, 0.4203), // oklab(0.4386 -0.0171 -0.0437)
            dark: rgb(0.688, 0.7897, 0.8924) // oklab(0.8263 -0.0169 -0.0432)
        ),
        actionHover: scDynamic(
            light: rgb(0.2017, 0.285, 0.367), // oklab(0.3956 -0.0162 -0.0414)
            dark: rgb(0.634, 0.7357, 0.8382) // oklab(0.7832 -0.0171 -0.0437)
        ),
        actionPressed: scDynamic(
            light: rgb(0.1764, 0.2388, 0.3007), // oklab(0.3526 -0.0126 -0.0322)
            dark: rgb(0.5917, 0.6813, 0.7717) // oklab(0.7402 -0.0153 -0.0391)
        ),
        container: scDynamic(
            light: rgb(0.8425, 0.8943, 0.947), // oklab(0.9131 -0.0085 -0.0216)
            dark: rgb(0.2017, 0.285, 0.367) // oklab(0.3956 -0.0162 -0.0414)
        ),
        onContainer: scDynamic(
            light: rgb(0.2017, 0.285, 0.367), // oklab(0.3956 -0.0162 -0.0414)
            dark: rgb(0.8425, 0.8943, 0.947) // oklab(0.9131 -0.0085 -0.0216)
        ),
        subtle: scDynamic(
            light: rgb(0.9205, 0.947, 0.9742), // oklab(0.9565 -0.0043 -0.011)
            dark: rgb(0.1553, 0.1937, 0.2322) // oklab(0.3098 -0.0081 -0.0207)
        ),
        outline: scDynamic(
            light: rgb(0.688, 0.7897, 0.8924), // oklab(0.8263 -0.0169 -0.0432)
            dark: rgb(0.2825, 0.3791, 0.4748) // oklab(0.4816 -0.018 -0.046)
        )
    )
    static let all: [SCChannel] = [.now, .transport, .visit, .justice, .build, .invest, .trade]
}

// MARK: - Space, radius, size (points), opacity

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
    /// Tables, full-bleed bands
    public static let none: CGFloat = 0
    /// Buttons, checkboxes, segmented controls, tags
    public static let control: CGFloat = 4
    /// Status chips
    public static let chip: CGFloat = 6
    /// Text inputs, selects, textareas, callouts
    public static let field: CGFloat = 8
    /// Cards, list groups, panels, dialogs, sheets
    public static let card: CGFloat = 12
    /// Circular marks and suggestion chips only
    public static let full: CGFloat = 9999
}

public enum SCSize {
    /// Minimum interactive target, every control
    public static let targetMin: CGFloat = 44
    /// Primary buttons and text fields
    public static let controlPrimary: CGFloat = 56
    /// Secondary and compact buttons, compact fields, selects in tables
    public static let controlSecondary: CGFloat = 48
    /// Visual height of chips; the target is extended to 44px
    public static let chip: CGFloat = 32
    /// Stepper step marker
    public static let stepperMarker: CGFloat = 28
    /// Icons in chips and inline with small text
    public static let iconS: CGFloat = 16
    /// Icons inline with body text and in fields
    public static let iconM: CGFloat = 20
    /// Standalone icons and icons in buttons
    public static let iconL: CGFloat = 24
    /// Focus ring width
    public static let focusRing: CGFloat = 3
    /// Gap between the control and the focus ring
    public static let focusOffset: CGFloat = 2
    /// Dividers and card edges
    public static let borderHairline: CGFloat = 1
    /// Control boundaries
    public static let borderControl: CGFloat = 1.5
    /// Error and selected boundaries, stepper connectors
    public static let borderStrong: CGFloat = 2
    /// Outlines that need a 3px accent. Start bars (field errors, callouts) use size-strip (W20)
    public static let borderAccent: CGFloat = 3
    /// The network and channel strip at the top of the header, and the start bar of a field error or callout (W11, W20)
    public static let strip: CGFloat = 4
    /// Maximum width of running text
    public static let measure: CGFloat = 680
}

public enum SCOpacity {
    /// Hover state layer on quiet controls (outlined and text buttons, rows, chips)
    public static let hover: Double = 0.08
    /// Pressed state layer on quiet controls
    public static let pressed: Double = 0.12
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
    public enum En {
        /// Home hero, from the expanded breakpoint
        public static let displayLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 80, lineHeight: 84, tracking: -1.6, relativeTo: .largeTitle)
        /// Channel hero, from the expanded breakpoint
        public static let displayMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 57, lineHeight: 62, tracking: -0.855, relativeTo: .largeTitle)
        /// Heroes on compact and medium; page heading on wide marketing pages
        public static let displaySmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 45, lineHeight: 50, tracking: -0.45, relativeTo: .largeTitle)
        /// Page heading (h1)
        public static let headlineLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 32, lineHeight: 38, tracking: 0, relativeTo: .title)
        /// Section heading (h2)
        public static let headlineMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 28, lineHeight: 34, tracking: 0, relativeTo: .title)
        /// Subsection heading (h3); totals and amounts
        public static let headlineSmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 24, lineHeight: 30, tracking: 0, relativeTo: .title)
        /// Card and panel titles
        public static let titleLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 22, lineHeight: 28, tracking: 0, relativeTo: .headline)
        /// Row titles, legend of a question group, emphasised values
        public static let titleMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 18, lineHeight: 24, tracking: 0, relativeTo: .headline)
        /// Navigation items, back link, summary-list values, step names
        public static let titleSmall = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 17, lineHeight: 22, tracking: 0, relativeTo: .headline)
        /// Body text: the default for running text
        public static let bodyLarge = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 18, lineHeight: 26, tracking: 0, relativeTo: .body)
        /// Hints, secondary text, table cells
        public static let bodyMedium = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 16, lineHeight: 24, tracking: 0, relativeTo: .body)
        /// Captions and fine print; the smallest text
        public static let bodySmall = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 14, lineHeight: 20, tracking: 0, relativeTo: .body)
        /// Buttons and field labels
        public static let labelLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 18, lineHeight: 22, tracking: 0, relativeTo: .subheadline)
        /// Chips, tabs, 48px buttons, error messages
        public static let labelMedium = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 16, lineHeight: 20, tracking: 0, relativeTo: .subheadline)
        /// Metadata labels, step counters, badges
        public static let labelSmall = SCTextStyle(postScriptName: "DubaiW23-Medium", size: 14, lineHeight: 18, tracking: 0, relativeTo: .subheadline)
    }
    public enum Ar {
        /// Home hero, from the expanded breakpoint
        public static let displayLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 88, lineHeight: 108, tracking: 0, relativeTo: .largeTitle)
        /// Channel hero, from the expanded breakpoint
        public static let displayMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 64, lineHeight: 80, tracking: 0, relativeTo: .largeTitle)
        /// Heroes on compact and medium; page heading on wide marketing pages
        public static let displaySmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 50, lineHeight: 64, tracking: 0, relativeTo: .largeTitle)
        /// Page heading (h1)
        public static let headlineLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 36, lineHeight: 48, tracking: 0, relativeTo: .title)
        /// Section heading (h2)
        public static let headlineMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 32, lineHeight: 44, tracking: 0, relativeTo: .title)
        /// Subsection heading (h3); totals and amounts
        public static let headlineSmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 28, lineHeight: 38, tracking: 0, relativeTo: .title)
        /// Card and panel titles
        public static let titleLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 24, lineHeight: 34, tracking: 0, relativeTo: .headline)
        /// Row titles, legend of a question group, emphasised values
        public static let titleMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 20, lineHeight: 30, tracking: 0, relativeTo: .headline)
        /// Navigation items, back link, summary-list values, step names
        public static let titleSmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 19, lineHeight: 28, tracking: 0, relativeTo: .headline)
        /// Body text: the default for running text
        public static let bodyLarge = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 20, lineHeight: 32, tracking: 0, relativeTo: .body)
        /// Hints, secondary text, table cells
        public static let bodyMedium = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 18, lineHeight: 28, tracking: 0, relativeTo: .body)
        /// Captions and fine print; the smallest text
        public static let bodySmall = SCTextStyle(postScriptName: "DubaiW23-Regular", size: 16, lineHeight: 24, tracking: 0, relativeTo: .body)
        /// Buttons and field labels
        public static let labelLarge = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 20, lineHeight: 28, tracking: 0, relativeTo: .subheadline)
        /// Chips, tabs, 48px buttons, error messages
        public static let labelMedium = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 18, lineHeight: 24, tracking: 0, relativeTo: .subheadline)
        /// Metadata labels, step counters, badges
        public static let labelSmall = SCTextStyle(postScriptName: "DubaiW23-Bold", size: 16, lineHeight: 22, tracking: 0, relativeTo: .subheadline)
    }
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

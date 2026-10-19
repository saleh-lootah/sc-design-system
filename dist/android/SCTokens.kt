// Generated — edit tokens/*.json
// Colours are converted from OKLAB to sRGB with the maths in scripts/oklab.py.
// The source OKLAB value is in the comment beside each colour.

package sc.designsystem.tokens // TODO: set to your app's package

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

// ---- Colour

data class SCColorScheme(
    val canvas: Color, // App/page background behind cards
    val grouped: Color, // Grouped-list background
    val surface: Color, // Cards, sheets, fields
    val rule: Color, // Decorative dividers (not a control boundary)
    val control: Color, // Control boundaries and inactive progress, >=3:1
    val muted: Color, // Secondary text, >=4.5:1 on surface and canvas
    val ink: Color, // Primary text
    val inkStrong: Color, // Headings and display
    val onAction: Color, // Text and icons on channel action colour
    val glass: Color, // Translucent bar fill (Liquid Glass approximation)
    val glassEdge: Color, // Hairline edge on glass
    val fillQuiet: Color, // Quiet control fill
    val fillSelected: Color, // Selected nav item fill
    val error: Color,
    val errorHover: Color,
    val errorPressed: Color,
    val onError: Color, // Text and icons on error fill
    val errorSurface: Color,
    val success: Color,
    val successSurface: Color,
    val warning: Color,
    val warningSurface: Color,
    val shadow: Color, // Base shadow colour; elevation tokens set their own alpha
)

val SCLightColors = SCColorScheme(
    canvas = Color(red = 0.9684f, green = 0.9681f, blue = 0.9712f, alpha = 1f), // oklab(0.976 0.0004 -0.001)
    grouped = Color(red = 0.9371f, green = 0.9377f, blue = 0.9467f, alpha = 1f), // oklab(0.953 0.0007 -0.003)
    surface = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    rule = Color(red = 0.894f, green = 0.8946f, blue = 0.9066f, alpha = 1f), // oklab(0.92 0.001 -0.004)
    control = Color(red = 0.4515f, green = 0.4511f, blue = 0.4779f, alpha = 1f), // oklab(0.558 0.003 -0.01)
    muted = Color(red = 0.3837f, green = 0.3846f, blue = 0.4052f, alpha = 1f), // oklab(0.498 0.002 -0.008)
    ink = Color(red = 0.1268f, green = 0.1254f, blue = 0.1366f, alpha = 1f), // oklab(0.245 0.002 -0.005)
    inkStrong = Color(red = 0.066f, green = 0.0663f, blue = 0.0742f, alpha = 1f), // oklab(0.178 0.001 -0.004)
    onAction = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    glass = Color(red = 1f, green = 1f, blue = 1f, alpha = 0.72f), // oklab(1 0 0 / 0.72)
    glassEdge = Color(red = 1f, green = 1f, blue = 1f, alpha = 0.9f), // oklab(1 0 0 / 0.9)
    fillQuiet = Color(red = 0.4691f, green = 0.4705f, blue = 0.5024f, alpha = 0.14f), // oklab(0.575 0.003 -0.012 / 0.14)
    fillSelected = Color(red = 0.4691f, green = 0.4705f, blue = 0.5024f, alpha = 0.16f), // oklab(0.575 0.003 -0.012 / 0.16)
    error = Color(red = 0.679f, green = 0.1884f, blue = 0.161f, alpha = 1f), // oklab(0.501 0.144 0.076)
    errorHover = Color(red = 0.6275f, green = 0.1618f, blue = 0.1374f, alpha = 1f), // oklab(0.47 0.138 0.073)
    errorPressed = Color(red = 0.5782f, green = 0.1367f, blue = 0.1152f, alpha = 1f), // oklab(0.44 0.132 0.07)
    onError = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    errorSurface = Color(red = 1f, green = 0.9417f, blue = 0.9381f, alpha = 1f), // oklab(0.967 0.015 0.006)
    success = Color(red = 0.1472f, green = 0.388f, blue = 0.2293f, alpha = 1f), // oklab(0.448 -0.081 0.043)
    successSurface = Color(red = 0.9237f, green = 0.9685f, blue = 0.9329f, alpha = 1f), // oklab(0.965 -0.015 0.008)
    warning = Color(red = 0.482f, green = 0.3181f, blue = 0f, alpha = 1f), // oklab(0.47 0.026 0.096)
    warningSurface = Color(red = 1f, green = 0.9568f, blue = 0.8678f, alpha = 1f), // oklab(0.97 0.003 0.032)
    shadow = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.05f), // oklab(0 0 0 / 0.05)
)

val SCDarkColors = SCColorScheme(
    canvas = Color(red = 0.066f, green = 0.0663f, blue = 0.0742f, alpha = 1f), // oklab(0.178 0.001 -0.004)
    grouped = Color(red = 0.066f, green = 0.0663f, blue = 0.0742f, alpha = 1f), // oklab(0.178 0.001 -0.004)
    surface = Color(red = 0.1268f, green = 0.1254f, blue = 0.1366f, alpha = 1f), // oklab(0.245 0.002 -0.005)
    rule = Color(red = 0.1995f, green = 0.2003f, blue = 0.2187f, alpha = 1f), // oklab(0.323 0.002 -0.008)
    control = Color(red = 0.5809f, green = 0.5805f, blue = 0.6086f, alpha = 1f), // oklab(0.669 0.003 -0.01)
    muted = Color(red = 0.7412f, green = 0.7413f, blue = 0.7618f, alpha = 1f), // oklab(0.8 0.002 -0.007)
    ink = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    inkStrong = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    onAction = Color(red = 0.066f, green = 0.0663f, blue = 0.0742f, alpha = 1f), // oklab(0.178 0.001 -0.004)
    glass = Color(red = 0.1574f, green = 0.1574f, blue = 0.1731f, alpha = 0.72f), // oklab(0.279 0.002 -0.007 / 0.72)
    glassEdge = Color(red = 1f, green = 1f, blue = 1f, alpha = 0.14f), // oklab(1 0 0 / 0.14)
    fillQuiet = Color(red = 1f, green = 1f, blue = 1f, alpha = 0.1f), // oklab(1 0 0 / 0.1)
    fillSelected = Color(red = 1f, green = 1f, blue = 1f, alpha = 0.14f), // oklab(1 0 0 / 0.14)
    error = Color(red = 0.9997f, green = 0.6975f, blue = 0.6625f, alpha = 1f), // oklab(0.834 0.082 0.041)
    errorHover = Color(red = 0.954f, green = 0.6553f, blue = 0.6209f, alpha = 1f), // oklab(0.8 0.082 0.041)
    errorPressed = Color(red = 0.9139f, green = 0.6183f, blue = 0.5847f, alpha = 1f), // oklab(0.77 0.082 0.041)
    onError = Color(red = 0.066f, green = 0.0663f, blue = 0.0742f, alpha = 1f), // oklab(0.178 0.001 -0.004)
    errorSurface = Color(red = 0.2742f, green = 0.1327f, blue = 0.1193f, alpha = 1f), // oklab(0.3 0.05 0.025)
    success = Color(red = 0.5712f, green = 0.845f, blue = 0.635f, alpha = 1f), // oklab(0.82 -0.09 0.05)
    successSurface = Color(red = 0.086f, green = 0.1981f, blue = 0.1167f, alpha = 1f), // oklab(0.29 -0.045 0.025)
    warning = Color(red = 0.9754f, green = 0.7493f, blue = 0.4081f, alpha = 1f), // oklab(0.84 0.03 0.12)
    warningSurface = Color(red = 0.2485f, green = 0.1575f, blue = 0.0466f, alpha = 1f), // oklab(0.3 0.02 0.05)
    shadow = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.35f), // oklab(0 0 0 / 0.35)
)

// ---- Channels

data class SCChannel(
    val name: String,
    val action: Color,
    val actionHover: Color,
    val actionPressed: Color,
    val washStart: Color,
    val washEnd: Color,
    val ink: Color,
    val subtle: Color,
)

object SCLightChannels {
    val now = SCChannel(
        name = "now",
        action = Color(red = 0.2119f, green = 0.3574f, blue = 0.9211f, alpha = 1f), // oklab(0.537 -0.011 -0.22)
        actionHover = Color(red = 0.1885f, green = 0.3239f, blue = 0.8657f, alpha = 1f), // oklab(0.507 -0.0107 -0.2134)
        actionPressed = Color(red = 0.1662f, green = 0.2906f, blue = 0.8108f, alpha = 1f), // oklab(0.477 -0.0103 -0.2068)
        washStart = Color(red = 0.8943f, green = 0.9339f, blue = 1f, alpha = 1f), // oklab(0.947 -0.004 -0.025)
        washEnd = Color(red = 0.8121f, green = 0.8657f, blue = 0.9841f, alpha = 1f), // oklab(0.896 -0.003 -0.044)
        ink = Color(red = 0.1178f, green = 0.165f, blue = 0.3696f, alpha = 1f), // oklab(0.307 0.0004 -0.094)
        subtle = Color(red = 0.8943f, green = 0.9339f, blue = 1f, alpha = 1f), // oklab(0.947 -0.004 -0.025)
    )
    val transport = SCChannel(
        name = "transport",
        action = Color(red = 0.6499f, green = 0.2401f, blue = 0.0126f, alpha = 1f), // oklab(0.501 0.111 0.1)
        actionHover = Color(red = 0.5982f, green = 0.2174f, blue = 0.0077f, alpha = 1f), // oklab(0.471 0.1047 0.0943)
        actionPressed = Color(red = 0.5473f, green = 0.1951f, blue = 0.0037f, alpha = 1f), // oklab(0.441 0.0984 0.0886)
        washStart = Color(red = 1f, green = 0.9143f, blue = 0.8528f, alpha = 1f), // oklab(0.948 0.017 0.027)
        washEnd = Color(red = 1f, green = 0.8083f, blue = 0.7093f, alpha = 1f), // oklab(0.888 0.043 0.049)
        ink = Color(red = 0.4163f, green = 0.18f, blue = 0.0545f, alpha = 1f), // oklab(0.379 0.068 0.068)
        subtle = Color(red = 1f, green = 0.9143f, blue = 0.8528f, alpha = 1f), // oklab(0.948 0.017 0.027)
    )
    val visit = SCChannel(
        name = "visit",
        action = Color(red = 0.6903f, green = 0.1318f, blue = 0.3102f, alpha = 1f), // oklab(0.501 0.176 0.026)
        actionHover = Color(red = 0.6421f, green = 0.0987f, blue = 0.2807f, alpha = 1f), // oklab(0.471 0.1707 0.0252)
        actionPressed = Color(red = 0.5946f, green = 0.0615f, blue = 0.2517f, alpha = 1f), // oklab(0.441 0.1654 0.0244)
        washStart = Color(red = 0.9831f, green = 0.9018f, blue = 0.8952f, alpha = 1f), // oklab(0.941 0.021 0.009)
        washEnd = Color(red = 0.9564f, green = 0.7964f, blue = 0.7761f, alpha = 1f), // oklab(0.876 0.042 0.021)
        ink = Color(red = 0.369f, green = 0.1212f, blue = 0.1562f, alpha = 1f), // oklab(0.339 0.089 0.024)
        subtle = Color(red = 0.9831f, green = 0.9018f, blue = 0.8952f, alpha = 1f), // oklab(0.941 0.021 0.009)
    )
    val justice = SCChannel(
        name = "justice",
        action = Color(red = 0.3995f, green = 0.2505f, blue = 0.7841f, alpha = 1f), // oklab(0.495 0.068 -0.187)
        actionHover = Color(red = 0.367f, green = 0.2191f, blue = 0.7327f, alpha = 1f), // oklab(0.465 0.066 -0.1814)
        actionPressed = Color(red = 0.3349f, green = 0.1878f, blue = 0.682f, alpha = 1f), // oklab(0.435 0.0639 -0.1758)
        washStart = Color(red = 0.9368f, green = 0.9064f, blue = 0.9809f, alpha = 1f), // oklab(0.94 0.015 -0.022)
        washEnd = Color(red = 0.8631f, green = 0.8113f, blue = 0.9519f, alpha = 1f), // oklab(0.876 0.027 -0.043)
        ink = Color(red = 0.2343f, green = 0.1651f, blue = 0.3988f, alpha = 1f), // oklab(0.339 0.041 -0.092)
        subtle = Color(red = 0.9368f, green = 0.9064f, blue = 0.9809f, alpha = 1f), // oklab(0.94 0.015 -0.022)
    )
    val build = SCChannel(
        name = "build",
        action = Color(red = 0.541f, green = 0.3255f, blue = 0.0053f, alpha = 1f), // oklab(0.494 0.043 0.1)
        actionHover = Color(red = 0.4952f, green = 0.2973f, blue = 0.0104f, alpha = 1f), // oklab(0.464 0.0401 0.0933)
        actionPressed = Color(red = 0.4504f, green = 0.2695f, blue = 0.0132f, alpha = 1f), // oklab(0.434 0.0373 0.0867)
        washStart = Color(red = 1f, green = 0.9414f, blue = 0.8629f, alpha = 1f), // oklab(0.962 0.008 0.03)
        washEnd = Color(red = 0.983f, green = 0.8668f, blue = 0.7218f, alpha = 1f), // oklab(0.913 0.017 0.056)
        ink = Color(red = 0.3528f, green = 0.2274f, blue = 0.0716f, alpha = 1f), // oklab(0.378 0.026 0.065)
        subtle = Color(red = 1f, green = 0.9414f, blue = 0.8629f, alpha = 1f), // oklab(0.962 0.008 0.03)
    )
    val invest = SCChannel(
        name = "invest",
        action = Color(red = 0.1505f, green = 0.4748f, blue = 0.2683f, alpha = 1f), // oklab(0.513 -0.101 0.054)
        actionHover = Color(red = 0.1214f, green = 0.4381f, blue = 0.2404f, alpha = 1f), // oklab(0.483 -0.098 0.0524)
        actionPressed = Color(red = 0.0918f, green = 0.4018f, blue = 0.2129f, alpha = 1f), // oklab(0.453 -0.0949 0.0508)
        washStart = Color(red = 0.8899f, green = 0.959f, blue = 0.9054f, alpha = 1f), // oklab(0.952 -0.023 0.012)
        washEnd = Color(red = 0.7833f, green = 0.9029f, blue = 0.8109f, alpha = 1f), // oklab(0.897 -0.04 0.021)
        ink = Color(red = 0.1305f, green = 0.2864f, blue = 0.1782f, alpha = 1f), // oklab(0.368 -0.058 0.031)
        subtle = Color(red = 0.8899f, green = 0.959f, blue = 0.9054f, alpha = 1f), // oklab(0.952 -0.023 0.012)
    )
    val trade = SCChannel(
        name = "trade",
        action = Color(red = 0.2383f, green = 0.3333f, blue = 0.4269f, alpha = 1f), // oklab(0.44 -0.018 -0.046)
        actionHover = Color(red = 0.2098f, green = 0.3008f, blue = 0.3899f, alpha = 1f), // oklab(0.41 -0.0175 -0.0446)
        actionPressed = Color(red = 0.1821f, green = 0.2687f, blue = 0.3535f, alpha = 1f), // oklab(0.38 -0.0169 -0.0432)
        washStart = Color(red = 0.9167f, green = 0.9457f, blue = 0.9723f, alpha = 1f), // oklab(0.955 -0.005 -0.011)
        washEnd = Color(red = 0.8367f, green = 0.8825f, blue = 0.9346f, alpha = 1f), // oklab(0.905 -0.007 -0.021)
        ink = Color(red = 0.1363f, green = 0.2043f, blue = 0.2905f, alpha = 1f), // oklab(0.321 -0.012 -0.044)
        subtle = Color(red = 0.9167f, green = 0.9457f, blue = 0.9723f, alpha = 1f), // oklab(0.955 -0.005 -0.011)
    )
    val all = listOf(now, transport, visit, justice, build, invest, trade)
}

object SCDarkChannels {
    val now = SCChannel(
        name = "now",
        action = Color(red = 0.6753f, green = 0.7444f, blue = 0.9989f, alpha = 1f), // oklab(0.811 0.004 -0.094)
        actionHover = Color(red = 0.6136f, green = 0.7134f, blue = 0.9586f, alpha = 1f), // oklab(0.78 -0.0047 -0.094)
        actionPressed = Color(red = 0.5776f, green = 0.676f, blue = 0.9189f, alpha = 1f), // oklab(0.75 -0.0047 -0.094)
        washStart = Color(red = 0.1486f, green = 0.1778f, blue = 0.2498f, alpha = 1f), // oklab(0.3 -0.0017 -0.035)
        washEnd = Color(red = 0.1931f, green = 0.2319f, blue = 0.3282f, alpha = 1f), // oklab(0.355 -0.0022 -0.0449)
        ink = Color(red = 0.8738f, green = 0.9091f, blue = 0.9912f, alpha = 1f), // oklab(0.93 -0.0015 -0.03)
        subtle = Color(red = 0.1486f, green = 0.1778f, blue = 0.2498f, alpha = 1f), // oklab(0.3 -0.0017 -0.035)
    )
    val transport = SCChannel(
        name = "transport",
        action = Color(red = 0.9998f, green = 0.7028f, blue = 0.5419f, alpha = 1f), // oklab(0.83 0.068 0.079)
        actionHover = Color(red = 0.9425f, green = 0.6314f, blue = 0.5103f, alpha = 1f), // oklab(0.78 0.0774 0.0698)
        actionPressed = Color(red = 0.9025f, green = 0.5945f, blue = 0.4745f, alpha = 1f), // oklab(0.75 0.0774 0.0698)
        washStart = Color(red = 0.2393f, green = 0.1568f, blue = 0.1249f, alpha = 1f), // oklab(0.3 0.026 0.0234)
        washEnd = Color(red = 0.314f, green = 0.2036f, blue = 0.1608f, alpha = 1f), // oklab(0.355 0.0334 0.0301)
        ink = Color(red = 0.9825f, green = 0.8859f, blue = 0.8492f, alpha = 1f), // oklab(0.93 0.0223 0.0201)
        subtle = Color(red = 0.2393f, green = 0.1568f, blue = 0.1249f, alpha = 1f), // oklab(0.3 0.026 0.0234)
    )
    val visit = SCChannel(
        name = "visit",
        action = Color(red = 0.9558f, green = 0.6634f, blue = 0.7115f, alpha = 1f), // oklab(0.81 0.088 0.013)
        actionHover = Color(red = 0.9158f, green = 0.6265f, blue = 0.6746f, alpha = 1f), // oklab(0.78 0.088 0.013)
        actionPressed = Color(red = 0.876f, green = 0.5899f, blue = 0.638f, alpha = 1f), // oklab(0.75 0.088 0.013)
        washStart = Color(red = 0.2402f, green = 0.1507f, blue = 0.1657f, alpha = 1f), // oklab(0.3 0.0346 0.0051)
        washEnd = Color(red = 0.3152f, green = 0.1954f, blue = 0.2158f, alpha = 1f), // oklab(0.355 0.0445 0.0066)
        ink = Color(red = 0.9845f, green = 0.8788f, blue = 0.8931f, alpha = 1f), // oklab(0.93 0.0297 0.0044)
        subtle = Color(red = 0.2402f, green = 0.1507f, blue = 0.1657f, alpha = 1f), // oklab(0.3 0.0346 0.0051)
    )
    val justice = SCChannel(
        name = "justice",
        action = Color(red = 0.7511f, green = 0.7147f, blue = 0.993f, alpha = 1f), // oklab(0.81 0.034 -0.0935)
        actionHover = Color(red = 0.714f, green = 0.6773f, blue = 0.9531f, alpha = 1f), // oklab(0.78 0.034 -0.0935)
        actionPressed = Color(red = 0.6773f, green = 0.6403f, blue = 0.9135f, alpha = 1f), // oklab(0.75 0.034 -0.0935)
        washStart = Color(red = 0.178f, green = 0.1681f, blue = 0.2445f, alpha = 1f), // oklab(0.3 0.012 -0.0329)
        washEnd = Color(red = 0.2325f, green = 0.2189f, blue = 0.3213f, alpha = 1f), // oklab(0.355 0.0154 -0.0423)
        ink = Color(red = 0.9059f, green = 0.8978f, blue = 0.9851f, alpha = 1f), // oklab(0.93 0.0103 -0.0282)
        subtle = Color(red = 0.178f, green = 0.1681f, blue = 0.2445f, alpha = 1f), // oklab(0.3 0.012 -0.0329)
    )
    val build = SCChannel(
        name = "build",
        action = Color(red = 0.853f, green = 0.7323f, blue = 0.6123f, alpha = 1f), // oklab(0.81 0.0215 0.05)
        actionHover = Color(red = 0.8146f, green = 0.695f, blue = 0.576f, alpha = 1f), // oklab(0.78 0.0215 0.05)
        actionPressed = Color(red = 0.7765f, green = 0.6581f, blue = 0.5401f, alpha = 1f), // oklab(0.75 0.0215 0.05)
        washStart = Color(red = 0.2267f, green = 0.1662f, blue = 0.1036f, alpha = 1f), // oklab(0.3 0.0138 0.0322)
        washEnd = Color(red = 0.2974f, green = 0.2162f, blue = 0.1316f, alpha = 1f), // oklab(0.355 0.0178 0.0413)
        ink = Color(red = 0.9655f, green = 0.8961f, blue = 0.8286f, alpha = 1f), // oklab(0.93 0.0119 0.0276)
        subtle = Color(red = 0.2267f, green = 0.1662f, blue = 0.1036f, alpha = 1f), // oklab(0.3 0.0138 0.0322)
    )
    val invest = SCChannel(
        name = "invest",
        action = Color(red = 0.652f, green = 0.8004f, blue = 0.686f, alpha = 1f), // oklab(0.81 -0.0505 0.027)
        actionHover = Color(red = 0.6153f, green = 0.7625f, blue = 0.6492f, alpha = 1f), // oklab(0.78 -0.0505 0.027)
        actionPressed = Color(red = 0.5789f, green = 0.725f, blue = 0.6128f, alpha = 1f), // oklab(0.75 -0.0505 0.027)
        washStart = Color(red = 0.1265f, green = 0.1999f, blue = 0.1453f, alpha = 1f), // oklab(0.3 -0.0309 0.0165)
        washEnd = Color(red = 0.1623f, green = 0.2615f, blue = 0.1885f, alpha = 1f), // oklab(0.355 -0.0397 0.0212)
        ink = Color(red = 0.8545f, green = 0.9335f, blue = 0.8714f, alpha = 1f), // oklab(0.93 -0.0265 0.0141)
        subtle = Color(red = 0.1265f, green = 0.1999f, blue = 0.1453f, alpha = 1f), // oklab(0.3 -0.0309 0.0165)
    )
    val trade = SCChannel(
        name = "trade",
        action = Color(red = 0.6354f, green = 0.7287f, blue = 0.8308f, alpha = 1f), // oklab(0.779 -0.015 -0.043)
        actionHover = Color(red = 0.6328f, green = 0.7314f, blue = 0.8307f, alpha = 1f), // oklab(0.78 -0.0166 -0.0424)
        actionPressed = Color(red = 0.5965f, green = 0.6942f, blue = 0.7925f, alpha = 1f), // oklab(0.75 -0.0166 -0.0424)
        washStart = Color(red = 0.1242f, green = 0.1858f, blue = 0.246f, alpha = 1f), // oklab(0.3 -0.0128 -0.0326)
        washEnd = Color(red = 0.1596f, green = 0.2425f, blue = 0.3234f, alpha = 1f), // oklab(0.355 -0.0164 -0.0419)
        ink = Color(red = 0.8511f, green = 0.9182f, blue = 0.9866f, alpha = 1f), // oklab(0.93 -0.0109 -0.0279)
        subtle = Color(red = 0.1242f, green = 0.1858f, blue = 0.246f, alpha = 1f), // oklab(0.3 -0.0128 -0.0326)
    )
    val all = listOf(now, transport, visit, justice, build, invest, trade)
}

// ---- Space, radius, size

object SCSpace {
    val s0 = 0.dp
    val s2 = 2.dp
    val s4 = 4.dp
    val s6 = 6.dp
    val s8 = 8.dp
    val s12 = 12.dp
    val s16 = 16.dp
    val s20 = 20.dp
    val s24 = 24.dp
    val s32 = 32.dp
    val s40 = 40.dp
    val s48 = 48.dp
    val s56 = 56.dp
    val s64 = 64.dp
    val s80 = 80.dp
    val s96 = 96.dp
    val s128 = 128.dp
}

object SCRadius {
    val xs = 6.dp
    val s = 10.dp
    val field = 14.dp // Inputs and selects
    val card = 20.dp // Cards and list groups
    val panel = 24.dp // Large panels, hero cards
    val sheet = 28.dp // Bottom sheets, dialogs
    val control = 22.dp // 44px glass controls
    val pill = 999.dp // Buttons, chips, search
}

object SCSize {
    val targetMin = 44.dp // Minimum interactive target
    val controlM = 44.dp
    val controlL = 54.dp // Primary buttons and fields
    val iconS = 16.dp
    val iconM = 20.dp
    val iconL = 24.dp
    val progress = 8.dp // Step progress track
    val measure = 680.dp // Max width of running text
    val focusRing = 3.dp
    val focusOffset = 2.dp
    val borderHairline = 1.dp // Dividers
    val borderControl = 1.5.dp // Field and control boundaries
    val borderStrong = 2.dp // Selected and error boundaries
    val borderAccent = 3.dp // Error bar on the start side of a field
}

// ---- Typography

// Placeholder. Wire the Dubai W23 files in res/font, for example:
// val DubaiFontFamily = FontFamily(
//     Font(R.font.dubai_w23_light, FontWeight.Light),
//     Font(R.font.dubai_w23_regular, FontWeight.Normal),
//     Font(R.font.dubai_w23_medium, FontWeight.Medium),
//     Font(R.font.dubai_w23_bold, FontWeight.Bold),
// )
val DubaiFontFamily: FontFamily = FontFamily.Default

object SCTypeLatin {
    // Home hero
    val displayXl = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 80.sp,
        lineHeight = 82.sp,
        letterSpacing = (-0.02).em,
    )
    val displayL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 48.sp,
        lineHeight = 50.sp,
        letterSpacing = (-0.015).em,
    )
    val headingXl = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 34.sp,
        lineHeight = 38.sp,
        letterSpacing = (-0.01).em,
    )
    val headingL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 30.sp,
        lineHeight = 34.sp,
        letterSpacing = (-0.01).em,
    )
    val headingM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 24.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    val titleL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 22.sp,
        lineHeight = 27.sp,
        letterSpacing = 0.em,
    )
    val titleM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 20.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Buttons, links, row titles
    val titleS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 17.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    val bodyL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 19.sp,
        lineHeight = 27.sp,
        letterSpacing = 0.em,
    )
    val bodyM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 17.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    val bodyS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 15.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    val labelM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 15.sp,
        lineHeight = 19.sp,
        letterSpacing = 0.em,
    )
    // Tags and chips
    val labelS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 14.sp,
        lineHeight = 17.sp,
        letterSpacing = 0.em,
    )
    // +1px from D+ (13/16)
    val eyebrow = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 14.sp,
        lineHeight = 17.sp,
        letterSpacing = 0.em,
    )
    // +1px from D+ (13/18)
    val caption = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 14.sp,
        lineHeight = 19.sp,
        letterSpacing = 0.em,
    )
    // +1px from D+ (12/15); smallest allowed
    val captionS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 13.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.em,
    )
    // Answers in summary lists
    val value = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 17.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.em,
    )
    // Field hints
    val hint = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 15.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    // Field error messages
    val error = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 15.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    // Amounts
    val numeralL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 34.sp,
        lineHeight = 38.sp,
        letterSpacing = (-0.01).em,
    )
}

object SCTypeArabic {
    val displayL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 50.sp,
        lineHeight = 62.sp,
        letterSpacing = 0.em,
    )
    val headingL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 30.sp,
        lineHeight = 38.sp,
        letterSpacing = 0.em,
    )
    val headingM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 26.sp,
        lineHeight = 34.sp,
        letterSpacing = 0.em,
    )
    // Buttons; +1px from D+ (18/24)
    val titleS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 19.sp,
        lineHeight = 25.sp,
        letterSpacing = 0.em,
    )
    val bodyL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 20.sp,
        lineHeight = 31.sp,
        letterSpacing = 0.em,
    )
    val bodyM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 19.sp,
        lineHeight = 29.sp,
        letterSpacing = 0.em,
    )
    val bodyS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 18.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    // Field labels; +1px from D+ (17/22)
    val labelM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 18.sp,
        lineHeight = 23.sp,
        letterSpacing = 0.em,
    )
    // +1px from D+ (16/24-25)
    val hint = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 17.sp,
        lineHeight = 26.sp,
        letterSpacing = 0.em,
    )
    // +1px from D+ (17/26)
    val error = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 18.sp,
        lineHeight = 27.sp,
        letterSpacing = 0.em,
    )
    // Smallest Arabic size
    val caption = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    val displayXl = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 84.sp,
        lineHeight = 100.sp,
        letterSpacing = 0.em,
    )
    val headingXl = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 36.sp,
        lineHeight = 46.sp,
        letterSpacing = 0.em,
    )
    val titleL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 24.sp,
        lineHeight = 32.sp,
        letterSpacing = 0.em,
    )
    val titleM = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 22.sp,
        lineHeight = 29.sp,
        letterSpacing = 0.em,
    )
    // Tags and chips
    val labelS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 16.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    val eyebrow = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 16.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em,
    )
    // Same as caption: Arabic never goes below 16px
    val captionS = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Answers in summary lists
    val value = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 19.sp,
        lineHeight = 26.sp,
        letterSpacing = 0.em,
    )
    // Amounts; digits stay Latin
    val numeralL = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 34.sp,
        lineHeight = 40.sp,
        letterSpacing = 0.em,
    )
}

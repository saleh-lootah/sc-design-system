// Generated — edit tokens/source/*.json or tokens/*.json, then npm run build
// Colours are converted from OKLAB to sRGB with the maths in scripts/lib/oklab.mjs.
// The source OKLAB value is in the comment beside each colour.

package sc.designsystem.tokens // TODO: set to your app's package

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

// ---- Colour roles

data class SCColorScheme(
    val surface: Color, // Page background
    val surfaceCard: Color, // Cards, fields, list groups, dialogs and sheets
    val surfaceContainer: Color, // Bands, panels, table headers, totals rows
    val surfaceContainerHigh: Color, // A container nested in a container; skeletons
    val onSurface: Color, // Primary text and icons
    val onSurfaceVariant: Color, // Secondary text: hints, captions, metadata
    val outline: Color, // Control boundaries (1.5px) and inactive markers; at least 3:1
    val outlineStrong: Color, // Hovered control edges, the sign-in edge and the plate chip; at least 3:1
    val outlineVariant: Color, // Dividers and card edges only; never the only edge of a control
    val inverseSurface: Color, // Tooltips and toasts
    val inverseOnSurface: Color, // Text on inverse-surface
    val disabledContainer: Color, // Fill of a disabled control
    val onDisabled: Color, // Text, icons and edges of a disabled control
    val focusRing: Color, // The 3px focus ring, drawn outside a 2px gap of surface
    val primary: Color, // City indigo: the network strip, sign-in and Dubai Pay hand-offs
    val onPrimary: Color, // Text and icons on primary
    val primaryHover: Color, // Primary fill on pointer hover
    val primaryPressed: Color, // Primary fill while pressed
    val primaryContainer: Color, // Selected or emphasised indigo container
    val onPrimaryContainer: Color, // Text and icons on primary-container
    val primarySubtle: Color, // Quiet indigo band or tint
    val error: Color, // Error text, icons, field edges and destructive fills
    val onError: Color, // Text and icons on an error fill
    val errorHover: Color, // Destructive fill on pointer hover
    val errorPressed: Color, // Destructive fill while pressed
    val errorContainer: Color, // Error summary, error chip and callout background
    val onErrorContainer: Color, // Strong text on error-container
    val success: Color, // Success text and icons; completed step markers
    val onSuccess: Color, // Text and icons on a success fill
    val successContainer: Color, // Success chip and callout background
    val onSuccessContainer: Color, // Strong text on success-container
    val warning: Color, // Warning text and icons
    val onWarning: Color, // Text and icons on a warning fill
    val warningContainer: Color, // Warning chip and callout background
    val onWarningContainer: Color, // Strong text on warning-container
    val info: Color, // Information text and icons
    val onInfo: Color, // Text and icons on an info fill
    val infoContainer: Color, // Information chip and callout background
    val onInfoContainer: Color, // Strong text on info-container
    val tintBlue: Color, // Decorative tile background
    val onTintBlue: Color, // Icon and short text on the tile
    val tintViolet: Color, // Decorative tile background
    val onTintViolet: Color, // Icon and short text on the tile
    val tintRose: Color, // Decorative tile background
    val onTintRose: Color, // Icon and short text on the tile
    val tintOrange: Color, // Decorative tile background
    val onTintOrange: Color, // Icon and short text on the tile
    val tintAmber: Color, // Decorative tile background
    val onTintAmber: Color, // Icon and short text on the tile
    val tintGreen: Color, // Decorative tile background
    val onTintGreen: Color, // Icon and short text on the tile
    val channelOnAction: Color, // Text and icons on any channel action fill (the same in every channel)
    val scrim: Color, // Behind modal dialogs and sheets
    val shadow: Color, // Base shadow colour; elevation layers set their own alpha
)

val SCLightColors = SCColorScheme(
    surface = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    surfaceCard = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    surfaceContainer = Color(red = 0.9515f, green = 0.9545f, blue = 0.9661f, alpha = 1f), // oklab(0.9656 0.0003 -0.004)
    surfaceContainerHigh = Color(red = 0.929f, green = 0.9321f, blue = 0.9436f, alpha = 1f), // oklab(0.9484 0.0003 -0.004)
    onSurface = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    onSurfaceVariant = Color(red = 0.3669f, green = 0.3694f, blue = 0.3791f, alpha = 1f), // oklab(0.4829 0.0003 -0.004)
    outline = Color(red = 0.3669f, green = 0.3694f, blue = 0.3791f, alpha = 1f), // oklab(0.4829 0.0003 -0.004)
    outlineStrong = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    outlineVariant = Color(red = 0.8844f, green = 0.8874f, blue = 0.8988f, alpha = 1f), // oklab(0.9139 0.0003 -0.004)
    inverseSurface = Color(red = 0.1869f, green = 0.1892f, blue = 0.1979f, alpha = 1f), // oklab(0.3104 0.0003 -0.004)
    inverseOnSurface = Color(red = 0.9515f, green = 0.9545f, blue = 0.9661f, alpha = 1f), // oklab(0.9656 0.0003 -0.004)
    disabledContainer = Color(red = 0.929f, green = 0.9321f, blue = 0.9436f, alpha = 1f), // oklab(0.9484 0.0003 -0.004)
    onDisabled = Color(red = 0.4635f, green = 0.4662f, blue = 0.4763f, alpha = 1f), // oklab(0.5691 0.0003 -0.004)
    focusRing = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    primary = Color(red = 0.2191f, green = 0.2515f, blue = 0.5249f, alpha = 1f), // oklab(0.4037 0.0099 -0.1152)
    onPrimary = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    primaryHover = Color(red = 0.1869f, green = 0.2156f, blue = 0.4201f, alpha = 1f), // oklab(0.3585 0.0077 -0.0896)
    primaryPressed = Color(red = 0.159f, green = 0.1814f, blue = 0.3068f, alpha = 1f), // oklab(0.3131 0.0049 -0.0576)
    primaryContainer = Color(red = 0.8584f, green = 0.8845f, blue = 0.9934f, alpha = 1f), // oklab(0.9149 0.0033 -0.0384)
    onPrimaryContainer = Color(red = 0.2191f, green = 0.2515f, blue = 0.5249f, alpha = 1f), // oklab(0.4037 0.0099 -0.1152)
    primarySubtle = Color(red = 0.9284f, green = 0.9422f, blue = 0.9975f, alpha = 1f), // oklab(0.9574 0.0016 -0.0192)
    error = Color(red = 0.7534f, green = 0.0016f, blue = 0.0411f, alpha = 1f), // oklab(0.508 0.183 0.098)
    onError = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    errorHover = Color(red = 0.6637f, green = 0.0034f, blue = 0.0324f, alpha = 1f), // oklab(0.4626 0.1664 0.0891)
    errorPressed = Color(red = 0.5774f, green = 0.0002f, blue = 0.0221f, alpha = 1f), // oklab(0.4173 0.1504 0.0806)
    errorContainer = Color(red = 0.9999f, green = 0.9285f, blue = 0.9173f, alpha = 1f), // oklab(0.9591 0.0178 0.0096)
    onErrorContainer = Color(red = 0.5774f, green = 0.0002f, blue = 0.0221f, alpha = 1f), // oklab(0.4173 0.1504 0.0806)
    success = Color(red = 0.0441f, green = 0.4283f, blue = 0.1784f, alpha = 1f), // oklab(0.4691 -0.11 0.067)
    onSuccess = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    successContainer = Color(red = 0.8725f, green = 0.9688f, blue = 0.8838f, alpha = 1f), // oklab(0.9525 -0.033 0.0201)
    onSuccessContainer = Color(red = 0.0014f, green = 0.3242f, blue = 0.1209f, alpha = 1f), // oklab(0.385 -0.0934 0.0569)
    warning = Color(red = 0.5152f, green = 0.3308f, blue = 0.0036f, alpha = 1f), // oklab(0.4878 0.032 0.099)
    onWarning = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    warningContainer = Color(red = 0.9952f, green = 0.9351f, blue = 0.8642f, alpha = 1f), // oklab(0.9578 0.009 0.0277)
    onWarningContainer = Color(red = 0.3913f, green = 0.2465f, blue = 0f, alpha = 1f), // oklab(0.4007 0.0264 0.0816)
    info = Color(red = 0.1659f, green = 0.3662f, blue = 0.6616f, alpha = 1f), // oklab(0.4856 -0.027 -0.13)
    onInfo = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    infoContainer = Color(red = 0.9124f, green = 0.9468f, blue = 0.998f, alpha = 1f), // oklab(0.9567 -0.0041 -0.0195)
    onInfoContainer = Color(red = 0.0963f, green = 0.2721f, blue = 0.5271f, alpha = 1f), // oklab(0.3996 -0.0243 -0.117)
    tintBlue = Color(red = 0.9111f, green = 0.947f, blue = 1f, alpha = 1f), // oklab(0.9567 -0.0043 -0.0202)
    onTintBlue = Color(red = 0.1479f, green = 0.3649f, blue = 0.6772f, alpha = 1f), // oklab(0.486 -0.029 -0.137)
    tintViolet = Color(red = 0.9536f, green = 0.935f, blue = 0.995f, alpha = 1f), // oklab(0.9585 0.0105 -0.0181)
    onTintViolet = Color(red = 0.4382f, green = 0.2964f, blue = 0.6467f, alpha = 1f), // oklab(0.4972 0.07 -0.121)
    tintRose = Color(red = 0.9998f, green = 0.927f, blue = 0.9328f, alpha = 1f), // oklab(0.9594 0.0198 0.0042)
    onTintRose = Color(red = 0.6388f, green = 0.2236f, blue = 0.3052f, alpha = 1f), // oklab(0.5005 0.137 0.029)
    tintOrange = Color(red = 0.98f, green = 0.9355f, blue = 0.9103f, alpha = 1f), // oklab(0.9579 0.0093 0.0118)
    onTintOrange = Color(red = 0.5515f, green = 0.307f, blue = 0.1436f, alpha = 1f), // oklab(0.4912 0.062 0.079)
    tintAmber = Color(red = 0.9622f, green = 0.9416f, blue = 0.9053f, alpha = 1f), // oklab(0.957 0.0019 0.0134)
    onTintAmber = Color(red = 0.4723f, green = 0.3496f, blue = 0.0889f, alpha = 1f), // oklab(0.4851 0.013 0.089)
    tintGreen = Color(red = 0.9117f, green = 0.9564f, blue = 0.9057f, alpha = 1f), // oklab(0.9547 -0.0165 0.0129)
    onTintGreen = Color(red = 0.121f, green = 0.4267f, blue = 0.0948f, alpha = 1f), // oklab(0.4695 -0.11 0.086)
    channelOnAction = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    scrim = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.5f), // oklab(0 0 0 / 0.5)
    shadow = Color(red = 0f, green = 0f, blue = 0f, alpha = 1f), // oklab(0 0 0)
)

val SCDarkColors = SCColorScheme(
    surface = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    surfaceCard = Color(red = 0.1212f, green = 0.1234f, blue = 0.1315f, alpha = 1f), // oklab(0.2415 0.0003 -0.004)
    surfaceContainer = Color(red = 0.1618f, green = 0.1641f, blue = 0.1725f, alpha = 1f), // oklab(0.2846 0.0003 -0.004)
    surfaceContainerHigh = Color(red = 0.204f, green = 0.2063f, blue = 0.2151f, alpha = 1f), // oklab(0.3277 0.0003 -0.004)
    onSurface = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    onSurfaceVariant = Color(red = 0.7747f, green = 0.7776f, blue = 0.7887f, alpha = 1f), // oklab(0.8277 0.0003 -0.004)
    outline = Color(red = 0.564f, green = 0.5667f, blue = 0.5772f, alpha = 1f), // oklab(0.6553 0.0003 -0.004)
    outlineStrong = Color(red = 0.8844f, green = 0.8874f, blue = 0.8988f, alpha = 1f), // oklab(0.9139 0.0003 -0.004)
    outlineVariant = Color(red = 0.2212f, green = 0.2236f, blue = 0.2325f, alpha = 1f), // oklab(0.3449 0.0003 -0.004)
    inverseSurface = Color(red = 0.8844f, green = 0.8874f, blue = 0.8988f, alpha = 1f), // oklab(0.9139 0.0003 -0.004)
    inverseOnSurface = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    disabledContainer = Color(red = 0.1869f, green = 0.1892f, blue = 0.1979f, alpha = 1f), // oklab(0.3104 0.0003 -0.004)
    onDisabled = Color(red = 0.564f, green = 0.5667f, blue = 0.5772f, alpha = 1f), // oklab(0.6553 0.0003 -0.004)
    focusRing = Color(red = 1f, green = 1f, blue = 1f, alpha = 1f), // oklab(1 0 0)
    primary = Color(red = 0.7183f, green = 0.7681f, blue = 0.9976f, alpha = 1f), // oklab(0.8306 0.0072 -0.0832)
    onPrimary = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    primaryHover = Color(red = 0.6569f, green = 0.7115f, blue = 0.973f, alpha = 1f), // oklab(0.7882 0.0082 -0.096)
    primaryPressed = Color(red = 0.5971f, green = 0.655f, blue = 0.9478f, alpha = 1f), // oklab(0.7459 0.0093 -0.1088)
    primaryContainer = Color(red = 0.2191f, green = 0.2515f, blue = 0.5249f, alpha = 1f), // oklab(0.4037 0.0099 -0.1152)
    onPrimaryContainer = Color(red = 0.8584f, green = 0.8845f, blue = 0.9934f, alpha = 1f), // oklab(0.9149 0.0033 -0.0384)
    primarySubtle = Color(red = 0.159f, green = 0.1814f, blue = 0.3068f, alpha = 1f), // oklab(0.3131 0.0049 -0.0576)
    error = Color(red = 1f, green = 0.7051f, blue = 0.6629f, alpha = 1f), // oklab(0.8375 0.0791 0.0424)
    onError = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    errorHover = Color(red = 0.9996f, green = 0.6253f, blue = 0.5752f, alpha = 1f), // oklab(0.7975 0.1024 0.0548)
    errorPressed = Color(red = 0.9994f, green = 0.5399f, blue = 0.484f, alpha = 1f), // oklab(0.7578 0.1275 0.0683)
    errorContainer = Color(red = 0.3513f, green = 0.1056f, blue = 0.0851f, alpha = 1f), // oklab(0.3213 0.0823 0.0441)
    onErrorContainer = Color(red = 1f, green = 0.8558f, blue = 0.8337f, alpha = 1f), // oklab(0.9183 0.0369 0.0198)
    success = Color(red = 0.6203f, green = 0.8279f, blue = 0.6501f, alpha = 1f), // oklab(0.8182 -0.0715 0.0436)
    onSuccess = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    successContainer = Color(red = 0.0924f, green = 0.2146f, blue = 0.1171f, alpha = 1f), // oklab(0.304 -0.0495 0.0302)
    onSuccessContainer = Color(red = 0.8173f, green = 0.9126f, blue = 0.8285f, alpha = 1f), // oklab(0.9094 -0.033 0.0201)
    warning = Color(red = 0.8908f, green = 0.7564f, blue = 0.5932f, alpha = 1f), // oklab(0.83 0.0208 0.0643)
    onWarning = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    warningContainer = Color(red = 0.2491f, green = 0.1757f, blue = 0.0796f, alpha = 1f), // oklab(0.3123 0.0144 0.0445)
    onWarningContainer = Color(red = 0.9421f, green = 0.8785f, blue = 0.8032f, alpha = 1f), // oklab(0.9147 0.0096 0.0297)
    info = Color(red = 0.6437f, green = 0.7864f, blue = 0.9995f, alpha = 1f), // oklab(0.8275 -0.0176 -0.0845)
    onInfo = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    infoContainer = Color(red = 0.1131f, green = 0.1911f, blue = 0.3078f, alpha = 1f), // oklab(0.311 -0.0122 -0.0585)
    onInfoContainer = Color(red = 0.8258f, green = 0.8935f, blue = 0.9944f, alpha = 1f), // oklab(0.9135 -0.0081 -0.039)
    tintBlue = Color(red = 0.1079f, green = 0.1909f, blue = 0.3141f, alpha = 1f), // oklab(0.3111 -0.013 -0.0617)
    onTintBlue = Color(red = 0.6429f, green = 0.7867f, blue = 0.9995f, alpha = 1f), // oklab(0.8275 -0.0179 -0.0845)
    tintViolet = Color(red = 0.2155f, green = 0.1641f, blue = 0.3017f, alpha = 1f), // oklab(0.3163 0.0315 -0.0544)
    onTintViolet = Color(red = 0.8229f, green = 0.7374f, blue = 0.988f, alpha = 1f), // oklab(0.8353 0.0455 -0.0786)
    tintRose = Color(red = 0.3029f, green = 0.1394f, blue = 0.1638f, alpha = 1f), // oklab(0.3182 0.0617 0.013)
    onTintRose = Color(red = 0.9997f, green = 0.6984f, blue = 0.7314f, alpha = 1f), // oklab(0.8388 0.0883 0.0187)
    tintOrange = Color(red = 0.2649f, green = 0.1668f, blue = 0.1069f, alpha = 1f), // oklab(0.3139 0.0279 0.0355)
    onTintOrange = Color(red = 0.9233f, green = 0.7408f, blue = 0.6341f, alpha = 1f), // oklab(0.8325 0.0403 0.0513)
    tintAmber = Color(red = 0.2311f, green = 0.1826f, blue = 0.0927f, alpha = 1f), // oklab(0.3112 0.0058 0.0401)
    onTintAmber = Color(red = 0.8555f, green = 0.7675f, blue = 0.6121f, alpha = 1f), // oklab(0.8284 0.0084 0.0579)
    tintGreen = Color(red = 0.1048f, green = 0.2141f, blue = 0.0938f, alpha = 1f), // oklab(0.3041 -0.0495 0.0387)
    onTintGreen = Color(red = 0.6362f, green = 0.8272f, blue = 0.6133f, alpha = 1f), // oklab(0.8182 -0.0715 0.0559)
    channelOnAction = Color(red = 0.1054f, green = 0.1075f, blue = 0.1155f, alpha = 1f), // oklab(0.2242 0.0003 -0.004)
    scrim = Color(red = 0f, green = 0f, blue = 0f, alpha = 0.64f), // oklab(0 0 0 / 0.64)
    shadow = Color(red = 0f, green = 0f, blue = 0f, alpha = 1f), // oklab(0 0 0)
)

// ---- Channels (text on action is SCColorScheme.channelOnAction)

data class SCChannel(
    val name: String,
    val action: Color,
    val actionHover: Color,
    val actionPressed: Color,
    val container: Color,
    val onContainer: Color,
    val subtle: Color,
    val outline: Color,
)

object SCLightChannels {
    val now = SCChannel(
        name = "now",
        action = Color(red = 0.1233f, green = 0.3591f, blue = 0.7131f, alpha = 1f), // oklab(0.4874 -0.03 -0.153)
        actionHover = Color(red = 0.0883f, green = 0.3115f, blue = 0.6417f, alpha = 1f), // oklab(0.4444 -0.0285 -0.1454)
        actionPressed = Color(red = 0.0522f, green = 0.265f, blue = 0.5715f, alpha = 1f), // oklab(0.4014 -0.027 -0.1377)
        container = Color(red = 0.824f, green = 0.8932f, blue = 0.9998f, alpha = 1f), // oklab(0.9135 -0.008 -0.041)
        onContainer = Color(red = 0.0522f, green = 0.265f, blue = 0.5715f, alpha = 1f), // oklab(0.4014 -0.027 -0.1377)
        subtle = Color(red = 0.9119f, green = 0.9467f, blue = 0.9999f, alpha = 1f), // oklab(0.9567 -0.004 -0.0202)
        outline = Color(red = 0.6468f, green = 0.7857f, blue = 0.9995f, alpha = 1f), // oklab(0.8276 -0.0166 -0.0845)
    )
    val transport = SCChannel(
        name = "transport",
        action = Color(red = 0.6462f, green = 0.2366f, blue = 0.0064f, alpha = 1f), // oklab(0.4982 0.111 0.1)
        actionHover = Color(red = 0.5703f, green = 0.2034f, blue = 0.0004f, alpha = 1f), // oklab(0.4539 0.1017 0.0916)
        actionPressed = Color(red = 0.4943f, green = 0.1724f, blue = 0.0012f, alpha = 1f), // oklab(0.4094 0.0916 0.0825)
        container = Color(red = 0.9999f, green = 0.8585f, blue = 0.8044f, alpha = 1f), // oklab(0.9177 0.033 0.0298)
        onContainer = Color(red = 0.4943f, green = 0.1724f, blue = 0.0012f, alpha = 1f), // oklab(0.4094 0.0916 0.0825)
        subtle = Color(red = 1f, green = 0.9299f, blue = 0.9033f, alpha = 1f), // oklab(0.9588 0.016 0.0144)
        outline = Color(red = 1f, green = 0.7107f, blue = 0.5985f, alpha = 1f), // oklab(0.8364 0.0705 0.0636)
    )
    val visit = SCChannel(
        name = "visit",
        action = Color(red = 0.64f, green = 0.2017f, blue = 0.4157f, alpha = 1f), // oklab(0.5033 0.155 -0.016)
        actionHover = Color(red = 0.5722f, green = 0.1618f, blue = 0.3656f, alpha = 1f), // oklab(0.4592 0.1472 -0.0152)
        actionPressed = Color(red = 0.5058f, green = 0.1217f, blue = 0.3166f, alpha = 1f), // oklab(0.4151 0.1395 -0.0144)
        container = Color(red = 0.9999f, green = 0.8487f, blue = 0.9039f, alpha = 1f), // oklab(0.9198 0.0462 -0.0048)
        onContainer = Color(red = 0.5058f, green = 0.1217f, blue = 0.3166f, alpha = 1f), // oklab(0.4151 0.1395 -0.0144)
        subtle = Color(red = 0.9999f, green = 0.925f, blue = 0.9514f, alpha = 1f), // oklab(0.9598 0.0223 -0.0023)
        outline = Color(red = 0.9997f, green = 0.689f, blue = 0.8115f, alpha = 1f), // oklab(0.8405 0.0993 -0.0102)
    )
    val justice = SCChannel(
        name = "justice",
        action = Color(red = 0.4199f, green = 0.3093f, blue = 0.6282f, alpha = 1f), // oklab(0.4951 0.059 -0.113)
        actionHover = Color(red = 0.37f, green = 0.2657f, blue = 0.5628f, alpha = 1f), // oklab(0.4516 0.056 -0.1074)
        actionPressed = Color(red = 0.3213f, green = 0.2229f, blue = 0.4984f, alpha = 1f), // oklab(0.408 0.0531 -0.1017)
        container = Color(red = 0.9014f, green = 0.873f, blue = 0.9821f, alpha = 1f), // oklab(0.9166 0.0177 -0.0339)
        onContainer = Color(red = 0.3213f, green = 0.2229f, blue = 0.4984f, alpha = 1f), // oklab(0.408 0.0531 -0.1017)
        subtle = Color(red = 0.9502f, green = 0.9364f, blue = 0.9918f, alpha = 1f), // oklab(0.9583 0.0088 -0.017)
        outline = Color(red = 0.8091f, green = 0.744f, blue = 0.9744f, alpha = 1f), // oklab(0.8342 0.0383 -0.0735)
    )
    val build = SCChannel(
        name = "build",
        action = Color(red = 0.4771f, green = 0.3489f, blue = 0.0002f, alpha = 1f), // oklab(0.4851 0.011 0.099)
        actionHover = Color(red = 0.4183f, green = 0.3044f, blue = 0.0015f, alpha = 1f), // oklab(0.4418 0.01 0.09)
        actionPressed = Color(red = 0.361f, green = 0.2608f, blue = 0.0001f, alpha = 1f), // oklab(0.3984 0.009 0.0813)
        container = Color(red = 0.9999f, green = 0.8728f, blue = 0.6252f, alpha = 1f), // oklab(0.9149 0.0097 0.0871)
        onContainer = Color(red = 0.361f, green = 0.2608f, blue = 0.0001f, alpha = 1f), // oklab(0.3984 0.009 0.0813)
        subtle = Color(red = 0.9915f, green = 0.9386f, blue = 0.8375f, alpha = 1f), // oklab(0.9571 0.0041 0.0366)
        outline = Color(red = 0.9531f, green = 0.7475f, blue = 0.2998f, alpha = 1f), // oklab(0.8304 0.0156 0.1406)
    )
    val invest = SCChannel(
        name = "invest",
        action = Color(red = 0.1827f, green = 0.4195f, blue = 0.153f, alpha = 1f), // oklab(0.4713 -0.093 0.074)
        actionHover = Color(red = 0.1461f, green = 0.3686f, blue = 0.1179f, alpha = 1f), // oklab(0.4288 -0.0883 0.0703)
        actionPressed = Color(red = 0.1094f, green = 0.319f, blue = 0.083f, alpha = 1f), // oklab(0.3864 -0.0837 0.0666)
        container = Color(red = 0.7627f, green = 0.9333f, blue = 0.7376f, alpha = 1f), // oklab(0.9055 -0.0632 0.0503)
        onContainer = Color(red = 0.1094f, green = 0.319f, blue = 0.083f, alpha = 1f), // oklab(0.3864 -0.0837 0.0666)
        subtle = Color(red = 0.8858f, green = 0.9663f, blue = 0.8735f, alpha = 1f), // oklab(0.9529 -0.0298 0.0237)
        outline = Color(red = 0.5684f, green = 0.8455f, blue = 0.5305f, alpha = 1f), // oklab(0.8145 -0.1023 0.0814)
    )
    val trade = SCChannel(
        name = "trade",
        action = Color(red = 0.2416f, green = 0.3315f, blue = 0.4203f, alpha = 1f), // oklab(0.4386 -0.0171 -0.0437)
        actionHover = Color(red = 0.2017f, green = 0.285f, blue = 0.367f, alpha = 1f), // oklab(0.3956 -0.0162 -0.0414)
        actionPressed = Color(red = 0.1764f, green = 0.2388f, blue = 0.3007f, alpha = 1f), // oklab(0.3526 -0.0126 -0.0322)
        container = Color(red = 0.8425f, green = 0.8943f, blue = 0.947f, alpha = 1f), // oklab(0.9131 -0.0085 -0.0216)
        onContainer = Color(red = 0.2017f, green = 0.285f, blue = 0.367f, alpha = 1f), // oklab(0.3956 -0.0162 -0.0414)
        subtle = Color(red = 0.9205f, green = 0.947f, blue = 0.9742f, alpha = 1f), // oklab(0.9565 -0.0043 -0.011)
        outline = Color(red = 0.688f, green = 0.7897f, blue = 0.8924f, alpha = 1f), // oklab(0.8263 -0.0169 -0.0432)
    )
    val all = listOf(now, transport, visit, justice, build, invest, trade)
}

object SCDarkChannels {
    val now = SCChannel(
        name = "now",
        action = Color(red = 0.6468f, green = 0.7857f, blue = 0.9995f, alpha = 1f), // oklab(0.8276 -0.0166 -0.0845)
        actionHover = Color(red = 0.5576f, green = 0.7311f, blue = 0.9995f, alpha = 1f), // oklab(0.785 -0.021 -0.1072)
        actionPressed = Color(red = 0.4676f, green = 0.6756f, blue = 0.9984f, alpha = 1f), // oklab(0.7427 -0.0255 -0.13)
        container = Color(red = 0.0522f, green = 0.265f, blue = 0.5715f, alpha = 1f), // oklab(0.4014 -0.027 -0.1377)
        onContainer = Color(red = 0.824f, green = 0.8932f, blue = 0.9998f, alpha = 1f), // oklab(0.9135 -0.008 -0.041)
        subtle = Color(red = 0.1f, green = 0.1895f, blue = 0.3284f, alpha = 1f), // oklab(0.3115 -0.0135 -0.0689)
        outline = Color(red = 0.1233f, green = 0.3591f, blue = 0.7131f, alpha = 1f), // oklab(0.4874 -0.03 -0.153)
    )
    val transport = SCChannel(
        name = "transport",
        action = Color(red = 1f, green = 0.7107f, blue = 0.5985f, alpha = 1f), // oklab(0.8364 0.0705 0.0636)
        actionHover = Color(red = 0.9779f, green = 0.6421f, blue = 0.5113f, alpha = 1f), // oklab(0.7951 0.0832 0.075)
        actionPressed = Color(red = 0.9498f, green = 0.5748f, blue = 0.4273f, alpha = 1f), // oklab(0.7536 0.0943 0.085)
        container = Color(red = 0.4943f, green = 0.1724f, blue = 0.0012f, alpha = 1f), // oklab(0.4094 0.0916 0.0825)
        onContainer = Color(red = 0.9999f, green = 0.8585f, blue = 0.8044f, alpha = 1f), // oklab(0.9177 0.033 0.0298)
        subtle = Color(red = 0.3054f, green = 0.1451f, blue = 0.0802f, alpha = 1f), // oklab(0.317 0.0499 0.045)
        outline = Color(red = 0.6462f, green = 0.2366f, blue = 0.0064f, alpha = 1f), // oklab(0.4982 0.111 0.1)
    )
    val visit = SCChannel(
        name = "visit",
        action = Color(red = 0.9997f, green = 0.689f, blue = 0.8115f, alpha = 1f), // oklab(0.8405 0.0993 -0.0102)
        actionHover = Color(red = 0.9752f, green = 0.6175f, blue = 0.763f, alpha = 1f), // oklab(0.7996 0.1163 -0.012)
        actionPressed = Color(red = 0.9463f, green = 0.5471f, blue = 0.7145f, alpha = 1f), // oklab(0.7586 0.1318 -0.0136)
        container = Color(red = 0.5058f, green = 0.1217f, blue = 0.3166f, alpha = 1f), // oklab(0.4151 0.1395 -0.0144)
        onContainer = Color(red = 0.9999f, green = 0.8487f, blue = 0.9039f, alpha = 1f), // oklab(0.9198 0.0462 -0.0048)
        subtle = Color(red = 0.3036f, green = 0.1328f, blue = 0.208f, alpha = 1f), // oklab(0.3195 0.0698 -0.0072)
        outline = Color(red = 0.64f, green = 0.2017f, blue = 0.4157f, alpha = 1f), // oklab(0.5033 0.155 -0.016)
    )
    val justice = SCChannel(
        name = "justice",
        action = Color(red = 0.8091f, green = 0.744f, blue = 0.9744f, alpha = 1f), // oklab(0.8342 0.0383 -0.0735)
        actionHover = Color(red = 0.7605f, green = 0.6841f, blue = 0.9467f, alpha = 1f), // oklab(0.7923 0.0442 -0.0848)
        actionPressed = Color(red = 0.7128f, green = 0.6244f, blue = 0.9187f, alpha = 1f), // oklab(0.7505 0.0501 -0.0961)
        container = Color(red = 0.3213f, green = 0.2229f, blue = 0.4984f, alpha = 1f), // oklab(0.408 0.0531 -0.1017)
        onContainer = Color(red = 0.9014f, green = 0.873f, blue = 0.9821f, alpha = 1f), // oklab(0.9166 0.0177 -0.0339)
        subtle = Color(red = 0.208f, green = 0.1683f, blue = 0.2944f, alpha = 1f), // oklab(0.3154 0.0265 -0.0509)
        outline = Color(red = 0.4199f, green = 0.3093f, blue = 0.6282f, alpha = 1f), // oklab(0.4951 0.059 -0.113)
    )
    val build = SCChannel(
        name = "build",
        action = Color(red = 0.9531f, green = 0.7475f, blue = 0.2998f, alpha = 1f), // oklab(0.8304 0.0156 0.1406)
        actionHover = Color(red = 0.8703f, green = 0.7001f, blue = 0.3458f, alpha = 1f), // oklab(0.7866 0.0132 0.1188)
        actionPressed = Color(red = 0.7737f, green = 0.6562f, blue = 0.4243f, alpha = 1f), // oklab(0.7426 0.0094 0.0842)
        container = Color(red = 0.361f, green = 0.2608f, blue = 0.0001f, alpha = 1f), // oklab(0.3984 0.009 0.0813)
        onContainer = Color(red = 0.9999f, green = 0.8728f, blue = 0.6252f, alpha = 1f), // oklab(0.9149 0.0097 0.0871)
        subtle = Color(red = 0.2331f, green = 0.1824f, blue = 0.0787f, alpha = 1f), // oklab(0.3111 0.005 0.0446)
        outline = Color(red = 0.4771f, green = 0.3489f, blue = 0.0002f, alpha = 1f), // oklab(0.4851 0.011 0.099)
    )
    val invest = SCChannel(
        name = "invest",
        action = Color(red = 0.5684f, green = 0.8455f, blue = 0.5305f, alpha = 1f), // oklab(0.8145 -0.1023 0.0814)
        actionHover = Color(red = 0.5266f, green = 0.7876f, blue = 0.4908f, alpha = 1f), // oklab(0.772 -0.0976 0.0777)
        actionPressed = Color(red = 0.5168f, green = 0.7227f, blue = 0.4878f, alpha = 1f), // oklab(0.7312 -0.079 0.0629)
        container = Color(red = 0.1094f, green = 0.319f, blue = 0.083f, alpha = 1f), // oklab(0.3864 -0.0837 0.0666)
        onContainer = Color(red = 0.7627f, green = 0.9333f, blue = 0.7376f, alpha = 1f), // oklab(0.9055 -0.0632 0.0503)
        subtle = Color(red = 0.1214f, green = 0.2107f, blue = 0.1093f, alpha = 1f), // oklab(0.305 -0.0418 0.0333)
        outline = Color(red = 0.1827f, green = 0.4195f, blue = 0.153f, alpha = 1f), // oklab(0.4713 -0.093 0.074)
    )
    val trade = SCChannel(
        name = "trade",
        action = Color(red = 0.688f, green = 0.7897f, blue = 0.8924f, alpha = 1f), // oklab(0.8263 -0.0169 -0.0432)
        actionHover = Color(red = 0.634f, green = 0.7357f, blue = 0.8382f, alpha = 1f), // oklab(0.7832 -0.0171 -0.0437)
        actionPressed = Color(red = 0.5917f, green = 0.6813f, blue = 0.7717f, alpha = 1f), // oklab(0.7402 -0.0153 -0.0391)
        container = Color(red = 0.2017f, green = 0.285f, blue = 0.367f, alpha = 1f), // oklab(0.3956 -0.0162 -0.0414)
        onContainer = Color(red = 0.8425f, green = 0.8943f, blue = 0.947f, alpha = 1f), // oklab(0.9131 -0.0085 -0.0216)
        subtle = Color(red = 0.1553f, green = 0.1937f, blue = 0.2322f, alpha = 1f), // oklab(0.3098 -0.0081 -0.0207)
        outline = Color(red = 0.2825f, green = 0.3791f, blue = 0.4748f, alpha = 1f), // oklab(0.4816 -0.018 -0.046)
    )
    val all = listOf(now, transport, visit, justice, build, invest, trade)
}

// ---- Space, radius, size, opacity

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
    val none = 0.dp // Tables, full-bleed bands
    val control = 4.dp // Buttons, checkboxes, segmented controls, tags
    val chip = 6.dp // Status chips
    val field = 8.dp // Text inputs, selects, textareas, callouts
    val card = 12.dp // Cards, list groups, panels, dialogs, sheets
    val full = 9999.dp // Circular marks and suggestion chips only
}

object SCSize {
    val targetMin = 44.dp // Minimum interactive target, every control
    val controlPrimary = 56.dp // Primary buttons and text fields
    val controlSecondary = 48.dp // Secondary and compact buttons, compact fields, selects in tables
    val chip = 32.dp // Visual height of chips; the target is extended to 44px
    val stepperMarker = 28.dp // Stepper step marker
    val iconS = 16.dp // Icons in chips and inline with small text
    val iconM = 20.dp // Icons inline with body text and in fields
    val iconL = 24.dp // Standalone icons and icons in buttons
    val focusRing = 3.dp // Focus ring width
    val focusOffset = 2.dp // Gap between the control and the focus ring
    val borderHairline = 1.dp // Dividers and card edges
    val borderControl = 1.5.dp // Control boundaries
    val borderStrong = 2.dp // Error and selected boundaries, stepper connectors
    val borderAccent = 3.dp // Bar on the start side of an error field group or callout
    val strip = 4.dp // The network and channel strip at the top of the header
    val measure = 680.dp // Maximum width of running text
}

object SCOpacity {
    const val hover = 0.08f // Hover state layer on quiet controls (outlined and text buttons, rows, chips)
    const val pressed = 0.12f // Pressed state layer on quiet controls
}

// ---- Typography

// Placeholder. Wire the Dubai W23 files in res/font, for example:
// val DubaiFontFamily = FontFamily(
//     Font(R.font.dubai_w23_regular, FontWeight.Normal),
//     Font(R.font.dubai_w23_medium, FontWeight.Medium),
//     Font(R.font.dubai_w23_bold, FontWeight.Bold),
// )
val DubaiFontFamily: FontFamily = FontFamily.Default

object SCTypeEn {
    // Home hero, from the expanded breakpoint
    val displayLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 80.sp,
        lineHeight = 84.sp,
        letterSpacing = (-0.02).em,
    )
    // Channel hero, from the expanded breakpoint
    val displayMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 57.sp,
        lineHeight = 62.sp,
        letterSpacing = (-0.015).em,
    )
    // Heroes on compact and medium; page heading on wide marketing pages
    val displaySmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 45.sp,
        lineHeight = 50.sp,
        letterSpacing = (-0.01).em,
    )
    // Page heading (h1)
    val headlineLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 32.sp,
        lineHeight = 38.sp,
        letterSpacing = 0.em,
    )
    // Section heading (h2)
    val headlineMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 28.sp,
        lineHeight = 34.sp,
        letterSpacing = 0.em,
    )
    // Subsection heading (h3); totals and amounts
    val headlineSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 24.sp,
        lineHeight = 30.sp,
        letterSpacing = 0.em,
    )
    // Card and panel titles
    val titleLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    // Row titles, legend of a question group, emphasised values
    val titleMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 18.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Navigation items, back link, summary-list values, step names
    val titleSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 17.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.em,
    )
    // Body text: the default for running text
    val bodyLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 18.sp,
        lineHeight = 26.sp,
        letterSpacing = 0.em,
    )
    // Hints, secondary text, table cells
    val bodyMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Captions and fine print; the smallest text
    val bodySmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.em,
    )
    // Buttons and field labels
    val labelLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 18.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.em,
    )
    // Chips, tabs, 48px buttons, error messages
    val labelMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 16.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.em,
    )
    // Metadata labels, step counters, badges
    val labelSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(500),
        fontSize = 14.sp,
        lineHeight = 18.sp,
        letterSpacing = 0.em,
    )
}

object SCTypeAr {
    // Home hero, from the expanded breakpoint
    val displayLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 88.sp,
        lineHeight = 108.sp,
        letterSpacing = 0.em,
    )
    // Channel hero, from the expanded breakpoint
    val displayMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 64.sp,
        lineHeight = 80.sp,
        letterSpacing = 0.em,
    )
    // Heroes on compact and medium; page heading on wide marketing pages
    val displaySmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 50.sp,
        lineHeight = 64.sp,
        letterSpacing = 0.em,
    )
    // Page heading (h1)
    val headlineLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 36.sp,
        lineHeight = 48.sp,
        letterSpacing = 0.em,
    )
    // Section heading (h2)
    val headlineMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 32.sp,
        lineHeight = 44.sp,
        letterSpacing = 0.em,
    )
    // Subsection heading (h3); totals and amounts
    val headlineSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 28.sp,
        lineHeight = 38.sp,
        letterSpacing = 0.em,
    )
    // Card and panel titles
    val titleLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 24.sp,
        lineHeight = 34.sp,
        letterSpacing = 0.em,
    )
    // Row titles, legend of a question group, emphasised values
    val titleMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 20.sp,
        lineHeight = 30.sp,
        letterSpacing = 0.em,
    )
    // Navigation items, back link, summary-list values, step names
    val titleSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 19.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    // Body text: the default for running text
    val bodyLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 20.sp,
        lineHeight = 32.sp,
        letterSpacing = 0.em,
    )
    // Hints, secondary text, table cells
    val bodyMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 18.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    // Captions and fine print; the smallest text
    val bodySmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(400),
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Buttons and field labels
    val labelLarge = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 20.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.em,
    )
    // Chips, tabs, 48px buttons, error messages
    val labelMedium = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 18.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em,
    )
    // Metadata labels, step counters, badges
    val labelSmall = TextStyle(
        fontFamily = DubaiFontFamily,
        fontWeight = FontWeight(700),
        fontSize = 16.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.em,
    )
}

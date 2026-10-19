# Building for mobile

The Shared Channels standard covers websites and mobile apps equally. This page explains what each kind of mobile team uses.

## What the channel apps are built with

The channel apps are built with **Flutter** and **React Native**. Neither can render web components, so each gets its own component kit. The kits implement the same component specs, read the same generated tokens, and pass the same conformance checklist as the web components.

| How the app is built | What the team uses | Status |
|---|---|---|
| **Flutter** | Generated Dart tokens (`dist/flutter/`: a `ThemeData` extension with colours, the seven channels, type styles, spacing, radii and motion), plus the `sc_flutter` widget kit | Tokens and kit: later stage |
| **React Native** | Generated TypeScript tokens (`dist/react-native/`: colours, channels, type styles, spacing, radii and motion, with a `useScTheme()` hook for light, dark and channel), plus the `@sc/react-native` component kit | Tokens and kit: later stage |
| **Native screens or modules (SwiftUI, Jetpack Compose)** | Generated tokens (`dist/ios/`, `dist/android/`) and the component specs | Tokens ready |
| **Hybrid apps or WebView screens** | The `sc-` web components, exactly as on the web | Phase 3 |
| **Mobile web** | The `sc-` web components | Phase 3 |

## Why separate kits for Flutter and React Native

Flutter and React Native draw their own interfaces, so web components can't run inside them. Even running them in a WebView would lose:
- native accessibility: VoiceOver and TalkBack rotor actions, Dynamic Type and font scaling, Switch Control
- system behaviour: haptics, keyboard types, autofill, sheets and back gestures
- performance

So each framework gets components that **look and behave to the same spec**, not the same code. Each kit maps to the platform's own accessibility: Flutter's `Semantics` and React Native's accessibility props. Both have to support Arabic right-to-left layout through the framework's RTL support (Flutter's `Directionality`, React Native's `I18nManager`).

## What stays identical across every platform

- **Tokens:** colour (OKLAB at source), type roles, spacing, radii, elevation, motion. Generated, never copied by hand.
- **Behaviour and content:** each spec in `COMPONENTS.md` defines states, error handling, wording, and Arabic and right-to-left behaviour once, for every platform.
- **Accessibility outcomes:** WCAG 2.2 AA on the web; the equivalent native success criteria in apps (WCAG2ICT), tested with VoiceOver and TalkBack.
- **Arabic:** Latin digits for amounts, plates, references and phone numbers; mirrored layout; Dubai Font with the Arabic type scale.
- **Channel theming:** one channel per screen, set once, and read by every component.

## Conformance

Each component spec will carry a conformance checklist that applies to every platform. A native kit component is done when it passes the same checklist as its web component.

## Open questions

- Which channels use Flutter and which use React Native? The answer decides which kit is built first.
- Which Flutter and React Native versions do the channel apps target? The kits support those versions and above.
- Are there shared native modules, such as UAE PASS and Dubai Pay integrations, that the kits should wrap?

# Next.JS GDPR Context Example

This example shows how to use React context api in your Next.JS app to handle GDPR. This repo is only using GTM and a custom logger to track events powered by the analytics plugin.

## It uses 
- [analytics](https://github.com/DavidWells/analytics) package to track user's consent. 
- [react-cookie-consent](https://github.com/Mastermindzh/react-cookie-consent) to display a cookie consent dialog.

## Environment variables
`.env.local`
```
NEXT_PUBLIC_GTM_ID="GTM-"
NEXT_IS_GDPR=true
```

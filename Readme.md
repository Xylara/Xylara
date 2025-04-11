# Xylara

A proxy site with some features

> Im still working on this so dont make a issue saying how to switch to scramjet. Scramjet itself is implimented you just need to switch the proxy via console which I assume most of you dont have.

# Features

- Ultraviolet
- Scramjet
- Transport switching
- More coming soon

# Self-Deployment

## With node

```
git clone https://github.com/Xylara/Xylara
cd Xylara
pnpm i
pnpm start
```

**The proxy will be on port 3001**

## With docker

```
git clone https://github.com/Xylara/Xylara
cd Xylara
docker build -t xylara .
docker run -p 80:3001 xylara
```
> You can change 80 to whatever port you like

# Credits

Titanium Network - Ultraviolet

Mercury Workshop - Srcamjet, Baremux, Wisp, Epoxy, Libcurl
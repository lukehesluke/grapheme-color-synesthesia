import {map, multiply, curry, pipe} from 'ramda'

// Taken from http://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
const LETTERS_BY_FREQUENCY = [
  'e',
  't',
  'a',
  'o',
  'i',
  'n',
  's',
  'r',
  'h',
  'd',
  'l',
  'u',
  'c',
  'm',
  'f',
  'y',
  'w',
  'g',
  'p',
  'b',
  'v',
  'k',
  'x',
  'q',
  'j',
  'z'
]
const DIGITS = '0123456789'.split('')

// http://godsnotwheregodsnot.blogspot.ru/2012/09/color-distribution-methodology.html
const HIGH_CONTRAST_COLOURS = [
  '#000000', //
  '#00ff00',
  '#0000ff',
  '#ff0000',
  '#01ffee',
  '#ffa6fe',
  '#ffdb66',
  '#006401',
  '#010067',
  '#95003a',
  '#007db5',
  '#ff00f6',
  '#ffeee8', //
  '#774d00',
  '#90fb92',
  '#0076ff',
  '#d5ff00',
  '#ff937e',
  '#6a826c', //
  '#ff029d',
  '#fe8900',
  '#7a4782',
  '#7e2dd2',
  '#85a900',
  '#ff0056',
  '#a42400',
  '#00ae7e',
  '#683d3b',
  '#bdc6ff',
  '#263400',
  '#bdd393',
  '#00b917',
  '#9e008e',
  '#001544',
  '#c28c9f',
  '#ff74a3',
  '#01d0ff',
  '#004754',
  '#e56ffe',
  '#788231',
  '#0e4ca1',
  '#91d0cb',
  '#be9970',
  '#968ae8',
  '#bb8800',
  '#43002c',
  '#deff74',
  '#00ffc6',
  '#ffe502',
  '#620e00',
  '#008f9c',
  '#98ff52',
  '#7544b1',
  '#b500ff',
  '#00ff78',
  '#ff6e41',
  '#005f39',
  '#6b6882',
  '#5fad4e',
  '#a75740',
  '#a5ffd2',
  '#ffb167',
  '#009bff',
  '#e85ebe'
]

const LIGHTNESS_RATIO = 3/5

const hexToRgb = hexString => {
  const components = /^\#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hexString)
    .slice(1)
    .map(componentHex => parseInt(componentHex, 16))
  const [r, g, b] = components
  return {r, g, b}
}

const zeroPad = curry((length, number) => {
  const numZeroes = Math.max(0, length - number.length)
  return `${'0'.repeat(numZeroes)}${number}`
})

const numberToHex = number => number.toString(16)

const rgbToHex = ({r, g, b}) => {
  const hexComponents = [r, g, b].map(pipe(numberToHex, zeroPad(2)))
  return `#${hexComponents.join('')}`
}

const round = x => Math.round(x)

const darkenRgb = map(pipe(multiply(LIGHTNESS_RATIO), round))

// High contrast colours are darkened so that they contrast well with white background.
const DARKENED_HIGH_CONTRAST_COLOURS = HIGH_CONTRAST_COLOURS.map(
  pipe(hexToRgb, darkenRgb, rgbToHex)
)

const GLYPHS_MAPPED_TO_COLOUR = LETTERS_BY_FREQUENCY.concat(DIGITS).reduce((map, glyph, i) => {
  const colour = DARKENED_HIGH_CONTRAST_COLOURS[i]
  return map.set(glyph, colour)
}, new Map())

export const getColour = glyph => GLYPHS_MAPPED_TO_COLOUR.get(glyph.toLowerCase())

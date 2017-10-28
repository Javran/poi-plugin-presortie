import { MemoId } from './structs'
import { splitMapId } from './selectors'

// an Array of Object {name, memoIdToLink}.
const memoLinks = []

const defineMemoLink = (name, memoIdToLink) => {
  memoLinks.push({name, memoIdToLink})
}

{
  const website = 'http://wikiwiki.jp/kancolle/'
  const worldTable = {
    1: '%C4%C3%BC%E9%C9%DC%B3%A4%B0%E8',
    2: '%C6%EE%C0%BE%BD%F4%C5%E7%B3%A4%B0%E8',
    3: '%CB%CC%CA%FD%B3%A4%B0%E8',
    4: '%C0%BE%CA%FD%B3%A4%B0%E8',
    5: '%C6%EE%CA%FD%B3%A4%B0%E8',
    6: '%C3%E6%C9%F4%B3%A4%B0%E8',
  }

  const memoIdToLink = MemoId.destruct({
    general: () => ({
      name: 'General',
      link: website,
    }),
    mapId: mapId => {
      const {area, num} = splitMapId(mapId)
      const worldPart = worldTable[area]
      const areaPart = `area${num}`
      return {
        name: `${area}-${num}`,
        link: `${website}?${worldPart}#${areaPart}`,
      }
    },
  })

  defineMemoLink(
    'wikiwiki',
    memoIdToLink,
  )
}

const defineSimpleMemoLink = (lName, website) => {
  const memoIdToLink = MemoId.destruct({
    general: () =>
      ({name: 'General', link: website}),
    mapId: mapId => {
      const {area, num} = splitMapId(mapId)
      return {
        name: `${area}-${num}`,
        link: `${website}/${area}-${num}`,
      }
    },
  })

  defineMemoLink(
    lName,
    memoIdToLink,
  )
}

defineSimpleMemoLink(
  'Wikia',
  'http://kancolle.wikia.com/wiki'
)

defineSimpleMemoLink(
  'KCWiki',
  'http://zh.kcwiki.org/wiki'
)

defineSimpleMemoLink(
  'moegirlpedia',
  'https://zh.moegirl.org/舰队Collection'
)

defineSimpleMemoLink(
  'Kancolle Wiki',
  'http://en.kancollewiki.net/wiki'
)

export {
  memoLinks,
}

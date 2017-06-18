// links to various kind of resources
import { MapInfo } from './structs'

const mapLinks = []

const mkMapInfoToLink = (prefix, mapInfoToLinkName=MapInfo.toShortString) =>
  mapInfo => {
    const {world, area} = mapInfo
    const name = mapInfoToLinkName(mapInfo)
    const link = `${prefix}/${world}-${area}`
    return {name, link}
  }

const defineMapLink = (
  name,
  mapInfoToLink,
) => {
  mapLinks.push({name, mapInfoToLink})
}

{
  const worldTable = {
    1: '%C4%C3%BC%E9%C9%DC%B3%A4%B0%E8',
    2: '%C6%EE%C0%BE%BD%F4%C5%E7%B3%A4%B0%E8',
    3: '%CB%CC%CA%FD%B3%A4%B0%E8',
    4: '%C0%BE%CA%FD%B3%A4%B0%E8',
    5: '%C6%EE%CA%FD%B3%A4%B0%E8',
    6: '%C3%E6%C9%F4%B3%A4%B0%E8',
  }

  defineMapLink(
    'wikiwiki',
    mapInfo => {
      const { world, area } = mapInfo
      const worldPart = worldTable[world]
      if (typeof worldPart === 'undefined')
        return null
      const areaPart = `#area${area}`
      return {
        name: MapInfo.toShortString(mapInfo),
        link: `http://wikiwiki.jp/kancolle/?${worldPart}#${areaPart}`,
      }
    })
}

defineMapLink(
  'Wikia',
  mkMapInfoToLink('http://kancolle.wikia.com/wiki'))

defineMapLink(
  'KCWiki',
  mkMapInfoToLink('http://zh.kcwiki.org/wiki'))

defineMapLink(
  'moegirlpedia',
  mkMapInfoToLink('https://zh.moegirl.org/舰队Collection'))

defineMapLink(
  'Kancolle Wiki',
  mkMapInfoToLink('http://en.kancollewiki.net/wiki'))

defineMapLink(
  'poi-statistics',
  mapInfo => ({
    name: MapInfo.toShortString(mapInfo),
    link: `http://db.kcwiki.org/drop/map//${mapInfo.id}`,
  }))

const getLinks = mapInfo => mapLinks.map( ml => {
  const linkInfo = ml.mapInfoToLink(mapInfo)
  if (linkInfo === null)
    return null
  return {
    name: `${ml.name}: ${linkInfo.name}`,
    link: linkInfo.link,
  }
}).filter(x => x !== null)

export {
  mapLinks,
  getLinks,
}

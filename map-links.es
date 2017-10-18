// links to various kind of resources
import { MapInfo } from './structs'

const mapLinks = []

/*
   TODO Refactor plan:
   due to the introduction of "general", the concept of
   a "map link" is now more of a "memo link", we'll change things
   so MemoId instead of MapId is used.
   We have been relying on map id too much here.
 */

// TODO: not feeling readable
const mkMapInfoToLink = (prefix, mapInfoToLinkName=MapInfo.toShortString) =>
  mapInfo => {
    const {area, num} = mapInfo
    const name = mapInfoToLinkName(mapInfo)
    const link = `${prefix}/${area}-${num}`
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
      /*
         a bit confusing, but wikiwiki is using 'area' for the sub-index
         while we are using 'area' to stand for worlds
       */
      const {area, num} = mapInfo
      const worldPart = worldTable[area]
      if (typeof worldPart === 'undefined')
        return null
      const areaPart = `area${num}`
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

defineMapLink(
  'KanColle OpenDB',
  mapInfo => ({
    name: MapInfo.toShortString(mapInfo),
    link: `http://swaytwig.com/opendb/ship_drop.php#w=${mapInfo.area}&m=${mapInfo.num}`,
  }))

const getLinks = mapInfo => mapLinks.map(ml => {
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

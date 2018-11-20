const callWS = require('./callWS')

const zones = new Map()

// Authentification
callWS.authentifier().then(() => {
  return callWS.getSetup()
}).then((reponse) => {
  descriptionZones(reponse.setup.rootPlace)
  afficherListeDevice(reponse.setup.devices)
}).catch((err) => {
  console.log(err)
})

var afficherListeDevice = (devices) => {
  devices.forEach(element => {
    console.log(`${element.label} - ${element.controllableName} - ${element.deviceURL}`)
    console.log(zones.get(element.placeOID).label)
    element.states.forEach(etat => {
      console.log('   ' + etat.name + ' : ' + etat.value)
    })
  })
}

var descriptionZones = (zone) => {
  if (zone.oid !== null) {
    zones.set(zone.oid, zone)
    zone.subPlaces.forEach((element) => {
      descriptionZones(element)
    })
  }
}

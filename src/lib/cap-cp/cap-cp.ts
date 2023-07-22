import { ElementCompact, xml2js } from "xml-js";
// import pointInPolygon from "point-in-polygon";
import Logger from "lib/logger";
import { CAPArea, CAPObject, CAPSeverity, CAPUrgency } from "types";
import { parseISO } from "date-fns";

const logger = new Logger("CAP-CP");

export class CAPCPFile {
  public identifier: string;
  public sender: string;
  public sent: Date;
  public references: string;
  public effective: Date;
  public expires: Date;
  public headline: string;
  public description: string;
  public instruction: string;
  public severity: CAPSeverity;
  public urgency: CAPUrgency;
  public areas: CAPArea[];
  public event: string;
  public certainty: string;
  public audience: string;

  constructor(capFileContents: string) {
    this.parseXMLToJS(capFileContents);
  }

  private parseXMLToJS(rawData: string) {
    if (!rawData) return;

    logger.log("Parsing CAP file");

    // convert it to a JS object
    const capObject: ElementCompact = xml2js(rawData, { compact: true });
    if (!capObject) return;

    const alert = capObject["alert"];
    if (!alert) return;

    // get the headers
    const { _text: identifier } = alert.identifier;
    const { _text: sender } = alert.sender;
    const { _text: sent } = alert.sent;
    const { _text: references } = alert.references;

    // get the info from the english portion (which presume is always first)
    const [info] = alert.info;
    if (!info) return;

    const { _text: effective } = info.effective;
    const { _text: expires } = info.expires;
    const { _text: headline } = info.headline;
    const { _text: description } = info.description;
    const { _text: instruction } = info.instruction;
    const { _text: severity } = info.severity;
    const { _text: urgency } = info.urgency;
    const areas = info.area;
    const { _text: event } = info.event;
    const { _text: certainty } = info.certainty;
    const { _text: audience } = info.audience;

    // convert dates to the correct type
    const sentDate = parseISO(sent);
    const effectiveDate = parseISO(effective);
    const expiresDate = parseISO(expires);

    // convert severity/urgency to the correct type
    const severityAsENUM: CAPSeverity = CAPSeverity[severity.toUpperCase() as keyof typeof CAPSeverity];
    const urgencyAsENUM: CAPUrgency = CAPUrgency[urgency.toUpperCase() as keyof typeof CAPUrgency];

    // convert areas to the correct type
    const capAreas: CAPArea[] = areas.map(({ areaDesc, polygon }: { areaDesc: string; polygon: string }) => ({
      description: areaDesc,
      polygon,
    }));

    // now we can store all this to the class
    this.areas = capAreas;
    this.identifier = identifier;
    this.sender = sender;
    this.sent = sentDate;
    this.references = references;
    this.effective = effectiveDate;
    this.expires = expiresDate;
    this.headline = headline;
    this.description = description;
    this.instruction = instruction;
    this.severity = severityAsENUM;
    this.urgency = urgencyAsENUM;
    this.event = event;
    this.certainty = certainty;
    this.audience = audience;

    logger.log("Parsed CAP file");
  }
}

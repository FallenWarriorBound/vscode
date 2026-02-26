import * as fs from 'fs';
import { joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import * as sigverify from 'sigverify';

export function verifyExtensionSignature(location: URI): boolean {
    try {
        const manifestPath = joinPath(location, 'package.json');
        const signaturePath = joinPath(location, 'package.json.sig');
        const manifest = fs.readFileSync(manifestPath.fsPath);
        const signature = fs.readFileSync(signaturePath.fsPath);
        return sigverify.verify(manifest, signature);
    } catch {
        return false;
    }
}

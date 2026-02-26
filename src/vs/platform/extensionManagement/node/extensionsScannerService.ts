/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IExtensionsProfileScannerService } from '../common/extensionsProfileScannerService.js';
import { IExtensionsScannerService, NativeExtensionsScannerService, IRelaxedScannedExtension, ExtensionScannerInput } from '../common/extensionsScannerService.js';
import Severity from '../../../base/common/severity.js';
import { verifyExtensionSignature } from './digitalSignatureVerifier.js';
import { IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsScannerService extends NativeExtensionsScannerService implements IExtensionsScannerService {

        constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			URI.file(environmentService.builtinExtensionsPath),
			URI.file(environmentService.extensionsPath),
			environmentService.userHome,
			userDataProfilesService.defaultProfile,
                        userDataProfilesService, extensionsProfileScannerService, fileService, logService, environmentService, productService, uriIdentityService, instantiationService);
        }

       protected override validate(extension: IRelaxedScannedExtension, input: ExtensionScannerInput): IRelaxedScannedExtension {
               extension = super.validate(extension, input);
               if (extension.isValid && verifyExtensionSignature(extension.location)) {
                       // signature is valid
               } else if (extension.isValid) {
                       extension.isValid = false;
                       extension.validations = [...extension.validations, [Severity.Error, 'Digital signature verification failed']];
               }
               return extension;
       }

}

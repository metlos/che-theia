/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import { RPCProtocol } from '@theia/plugin-ext/lib/api/rpc-protocol';
import { PLUGIN_RPC_CONTEXT, CheApiMain } from '../common/che-protocol';
import * as che from '@eclipse-che/plugin';

export class CheApiPluginImpl {

    private readonly delegate: CheApiMain;

    constructor(rpc: RPCProtocol) {
        this.delegate = rpc.getProxy(PLUGIN_RPC_CONTEXT.CHE_API_MAIN);
    }

    getSettings(): Promise<che.WorkspaceSettings> {
        throw new Error('Method not implemented.');
    }
    stop(workspaceId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    startTemporary(config: che.WorkspaceConfig): Promise<any> {
        throw new Error('Method not implemented.');
    }
    start(workspaceId: string, environmentName: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    deleteWorkspace(workspaceId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    update(workspaceId: string, workspace: che.Workspace): Promise<any> {
        throw new Error('Method not implemented.');
    }
    create(config: che.WorkspaceConfig, params: che.ResourceCreateQueryParams): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getById(workspaceKey: string): Promise<che.Workspace> {
        throw new Error('Method not implemented.');
    }
    getAllByNamespace(namespace: string): Promise<che.Workspace[]> {
        throw new Error('Method not implemented.');
    }
    getAll(): Promise<che.Workspace[]> {
        throw new Error('Method not implemented.');
    }

    getCurrentWorkspace(): Promise<che.Workspace> {
        return this.delegate.$currentWorkspace();
    }

    async getFactoryById(factoryId: string): Promise<che.Factory> {
        try {
            const myFactory = await this.delegate.$getFactoryById(factoryId);
            return myFactory;
        } catch (e) {
            return Promise.reject(e);
        }
    }

}
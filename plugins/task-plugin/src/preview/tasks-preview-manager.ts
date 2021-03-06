/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from 'inversify';
import * as theia from '@theia/plugin';
import * as startPoint from '../task-plugin-backend';
import { PreviewUrlsWidgetFactory } from './previews-widget';
import * as path from 'path';
import { PreviewUrlOpenService } from './preview-url-open-service';

export const PREVIEW_URL_TITLE = 'Preview URLs';
export const PREVIEW_URL_VIEW_TYPE = 'PreviewUrlView';
export const EXTERNALLY_CHOICE = 'externally';
export const INTERNALLY_CHOICE = 'internally';

export const STATUS_BAR_PREVIEW = {
    id: 'show.preview.urls',
    label: 'Show Preview URLs',
    title: 'Previews'
};

@injectable()
export class TasksPreviewManager {

    private currentPanel: theia.WebviewPanel | undefined;

    @inject(PreviewUrlsWidgetFactory)
    protected readonly previewUrlsWidgetFactory!: PreviewUrlsWidgetFactory;

    @inject(PreviewUrlOpenService)
    protected readonly previewUrlOpenService!: PreviewUrlOpenService;

    init() {
        this.setStatusBarPreviewUrlItem();
    }

    async showPreviews() {
        const executions = theia.tasks.taskExecutions;
        const tasks = executions.map(execution => execution.task);

        const context = startPoint.getContext();
        const previewsWidget = await this.previewUrlsWidgetFactory.createWidget({ tasks: tasks });

        const panel = this.providePanel();
        panel.webview.html = previewsWidget.getHtml();
        panel.webview.onDidReceiveMessage(message => this.onMessageReceived(message), undefined, context.subscriptions);
        panel.onDidDispose(() => { this.currentPanel = undefined; }, undefined, context.subscriptions);
    }

    // tslint:disable-next-line:no-any
    private onMessageReceived(message: any) {
        if (message.command !== 'preview') {
            return;
        }

        const url = message.url;
        if (EXTERNALLY_CHOICE === message.choice) {
            this.previewUrlOpenService.previewExternally(url);
            return;
        }

        if (INTERNALLY_CHOICE === message.choice) {
            this.previewUrlOpenService.previewInternally(url);
        }
    }

    private providePanel(): theia.WebviewPanel {
        if (this.currentPanel) {
            // TODO improve way of updating webview panel
            // depends on https://github.com/theia-ide/theia/issues/4342 and https://github.com/theia-ide/theia/issues/4339
            this.currentPanel.dispose();
        }

        return this.currentPanel = theia.window.createWebviewPanel(PREVIEW_URL_VIEW_TYPE, PREVIEW_URL_TITLE, { area: theia.WebviewPanelTargetArea.Bottom }, {
            enableScripts: true,
            localResourceRoots: [theia.Uri.file(path.join(startPoint.getContext().extensionPath, 'resources'))]
        });
    }

    private async setStatusBarPreviewUrlItem() {
        const previewCommandSubscription = theia.commands.registerCommand(STATUS_BAR_PREVIEW, () => this.showPreviews());
        startPoint.getSubscriptions().push(previewCommandSubscription);

        const item = await theia.window.createStatusBarItem(theia.StatusBarAlignment.Left);

        item.text = `$(link) ${STATUS_BAR_PREVIEW.title}`;
        item.tooltip = STATUS_BAR_PREVIEW.label;
        item.command = STATUS_BAR_PREVIEW.id;
        item.show();
    }
}

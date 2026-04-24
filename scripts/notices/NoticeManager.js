import { TemplateUtils } from "../utils/TemplateUtils.js";
import { SemverUtils } from "../utils/SemverUtils.js";
import { chatProxy } from "../utils/ChatProxy.js";

/**
 * Handles display of update notices to the user.
 * Ported from the original `u` class.
 */
export class NoticeManager {
  constructor(gameRef, moduleSettings) {
    this.gameRef = gameRef;
    this.moduleSettings = moduleSettings;
  }

  async checkForNotices() {
    // Current version declared and not read yet
    if (
      this.noticeForCurrentVersionIsDeclared() &&
      !this.noticeForCurrentVersionWasRead() &&
      (await this.noticeFileExistsForCurrentVersion())
    ) {
      await this.spawnNotice(this.moduleSettings.getVersion());
      return;
    }

    // Fallback to previous version if applicable
    if (
      !(await this.previousNoticeExists()) ||
      this.noticeForPreviousVersionWasRead() ||
      this.noticeForCurrentVersionWasRead()
    ) {
      return;
    }

    await this.spawnNotice(this.getPreviousVersion());
  }

  noticeFileExistsForCurrentVersion() {
    return this.noticeFileExists(this.moduleSettings.getVersion());
  }

  noticeForCurrentVersionWasRead() {
    return this.moduleSettings
      .getListOfReadNoticesVersions()
      .includes(this.moduleSettings.getVersion());
  }

  noticeForCurrentVersionIsDeclared() {
    return this.moduleSettings
      .getVersionsWithNotices()
      .includes(this.moduleSettings.getVersion());
  }

  async previousNoticeExists() {
    const previous = this.getPreviousVersion();
    if (!previous) return false;
    return this.noticeFileExists(previous);
  }

  noticeForPreviousVersionWasRead() {
    return this.moduleSettings
      .getListOfReadNoticesVersions()
      .includes(this.getPreviousVersion());
  }

  getPreviousVersion() {
    const versions = this.moduleSettings.getVersionsWithNotices();
    const sorted = SemverUtils.sortSemver(versions);
    return sorted.filter((v) => v !== this.moduleSettings.getVersion())[0];
  }

  /**
   * Post notice HTML to chat once per version (no modal).
   * @param {string} version — notice template semver (e.g. 4.3.0)
   */
  async spawnNotice(version) {
    const path = this.getPathOfNotice(version);
    const html = await TemplateUtils.renderTemplate(path);
    await chatProxy.create({
      user: this.gameRef.user.id,
      speaker: {
        alias: this.gameRef.i18n.localize("wctrl.notice.ChatSpeaker"),
      },
      content: html,
    });
    this.markNoticeAsSeen(version);
  }

  markNoticeAsSeen(version) {
    this.moduleSettings.addVersionToReadNotices(version);
  }

  async noticeFileExists(version) {
    const path = this.getPathOfNotice(version);
    try {
      return TemplateUtils.srcExists(path);
    } catch (err) {
      return false;
    }
  }

  getPathOfNotice(version) {
    return `modules/${this.moduleSettings.getModuleName()}/templates/notices/${version}.html`;
  }
}

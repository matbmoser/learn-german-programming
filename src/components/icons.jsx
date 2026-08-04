// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Mathias Brunkow Moser
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// This file was generated with AI assistance (Claude Code, Anthropic).

// ============================================================================
//  Every icon in the UI, in one place.
//
//  These replace the emoji / dingbat glyphs the app used to print inline
//  ("✕", "👩‍🏫", "🎲", …), which rendered differently on every platform and
//  could not be recoloured. Each wrapper renders at the font size of its
//  container (`fontSize="inherit"`) and inherits `currentColor`, so the
//  existing CSS keeps full control — see `.mi` in styles.css.
//
//  Deep imports (`@mui/icons-material/X`) keep the bundle to the icons we
//  actually use instead of pulling in the whole set.
// ============================================================================

import React from "react";

import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowRightAltRounded from "@mui/icons-material/ArrowRightAltRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CasinoRounded from "@mui/icons-material/CasinoRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import FullscreenExitRounded from "@mui/icons-material/FullscreenExitRounded";
import FullscreenRounded from "@mui/icons-material/FullscreenRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import GridViewRounded from "@mui/icons-material/GridViewRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import LightbulbRounded from "@mui/icons-material/LightbulbRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import UndoRounded from "@mui/icons-material/UndoRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";

/** Wraps a MUI icon so it scales with the surrounding text and stays hidden
 *  from screen readers — every icon here sits next to a label or a titled
 *  button that already carries the accessible name. */
function icon(Base, displayName) {
  function Icon({ className, ...rest }) {
    return (
      <Base
        fontSize="inherit"
        aria-hidden="true"
        focusable="false"
        className={className ? `mi ${className}` : "mi"}
        {...rest}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

// -- chrome / navigation ----------------------------------------------------
export const IconClose          = icon(CloseRounded, "IconClose");
export const IconBack           = icon(ArrowBackRounded, "IconBack");
export const IconBook           = icon(MenuBookRounded, "IconBook");
export const IconFullscreen     = icon(FullscreenRounded, "IconFullscreen");
export const IconFullscreenExit = icon(FullscreenExitRounded, "IconFullscreenExit");
export const IconGitHub         = icon(GitHubIcon, "IconGitHub");

// -- teacher chat -----------------------------------------------------------
export const IconTeacher   = icon(SchoolRounded, "IconTeacher");
export const IconInfo      = icon(InfoRounded, "IconInfo");
export const IconHistory   = icon(HistoryRounded, "IconHistory");
export const IconArrowUp   = icon(ArrowUpwardRounded, "IconArrowUp");
export const IconArrowDown = icon(ArrowDownwardRounded, "IconArrowDown");

// -- verdicts / corrections -------------------------------------------------
export const IconCheck       = icon(CheckRounded, "IconCheck");
export const IconCheckCircle = icon(CheckCircleRounded, "IconCheckCircle");
export const IconCancel      = icon(CancelRounded, "IconCancel");
export const IconUndo        = icon(UndoRounded, "IconUndo");
export const IconWarning     = icon(WarningAmberRounded, "IconWarning");
export const IconArrowRight  = icon(ArrowRightAltRounded, "IconArrowRight");

// -- writing workspace ------------------------------------------------------
export const IconGallery  = icon(GridViewRounded, "IconGallery");
export const IconDice     = icon(CasinoRounded, "IconDice");
export const IconRun      = icon(PlayArrowRounded, "IconRun");
export const IconDownload = icon(FileDownloadRounded, "IconDownload");
export const IconSparkle  = icon(AutoAwesomeRounded, "IconSparkle");
export const IconIdea     = icon(LightbulbRounded, "IconIdea");

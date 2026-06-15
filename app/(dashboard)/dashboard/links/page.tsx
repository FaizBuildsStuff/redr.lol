"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check, Copy, ExternalLink, Globe2, Link2, Loader2, Save, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  iconType: string;
  linkType: "link" | "text";
  prefix?: string;
  active: boolean;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  bg: string;
  prefix: string;
  displayPrefix: string;
  placeholder: string;
  textPlaceholder: string;
  hasAsset: boolean;
  inlineSvg?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────
// Inline SVG Icons (brand SVGs for platforms without /assets files)
// ─────────────────────────────────────────────────────────────────────

const IconSnapchat = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12.065 2c1.552 0 5.294.45 6.875 4.323.33.806.285 2.19.248 3.36l-.008.244c0 .04.025.077.063.092a.88.88 0 0 0 .302.047c.273 0 .57-.082.84-.205.128-.059.262-.09.387-.09.252 0 .48.08.647.223.238.2.304.478.177.737-.188.386-.752.654-1.52.72-.024.003-.048.004-.072.004-.078 0-.157-.01-.236-.03l-.053-.013c-.057-.015-.12-.026-.19-.026-.086 0-.178.019-.254.083-.096.082-.126.223-.094.423.208 1.312 1.164 2.363 2.267 3.2.266.198.543.37.822.52.133.07.207.2.195.34-.01.113-.084.218-.208.29-.54.31-1.345.52-2.485.647l-.098.011c-.155.018-.266.138-.31.292-.04.14-.1.376-.173.392-.053.013-.12.02-.193.02-.246 0-.612-.077-1.099-.23-.617-.194-1.204-.29-1.743-.29-.37 0-.735.046-1.086.138-.575.152-1.01.538-1.3.73-.097.063-.202.096-.31.096-.12 0-.24-.04-.34-.114-.285-.194-.745-.577-1.29-.73a4.48 4.48 0 0 0-1.086-.138c-.54 0-1.127.096-1.744.29-.487.153-.853.23-1.099.23-.072 0-.14-.007-.192-.02-.075-.016-.134-.252-.174-.392-.044-.154-.155-.274-.31-.292l-.097-.011c-1.14-.127-1.945-.338-2.486-.648-.123-.07-.198-.176-.207-.29-.012-.14.062-.27.195-.34.28-.15.556-.322.822-.52 1.103-.837 2.06-1.888 2.266-3.2.032-.2.002-.34-.093-.423-.077-.064-.169-.083-.255-.083-.07 0-.133.011-.19.026l-.053.013a1.178 1.178 0 0 1-.235.03c-.025 0-.049 0-.072-.003-.77-.066-1.333-.334-1.52-.72-.128-.26-.062-.537.176-.737.167-.143.395-.224.647-.224.125 0 .26.032.387.09.27.124.567.206.84.206.12 0 .23-.018.302-.047a.098.098 0 0 0 .063-.092l-.008-.244c-.037-1.17-.082-2.554.248-3.36C6.712 2.45 10.513 2 12.065 2z"/>
  </svg>
);

const IconDiscord = () => (
  <svg viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
);

const IconTelegram = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const IconSoundCloud = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M1.175 12.225c-.015 0-.03 0-.044.002A.547.547 0 0 0 .6 12.77l-.6 3.548.6 3.546c.028.28.27.496.531.496.015 0 .03 0 .044-.002.274-.015.487-.246.487-.522l.69-3.518-.69-3.55a.53.53 0 0 0-.487-.543zm2.137-.636c-.013 0-.026 0-.038.002a.563.563 0 0 0-.525.563l-.756 4.22.756 4.22c.03.3.28.532.563.532.013 0 .026 0 .038-.002.305-.018.543-.271.543-.563l.857-4.187-.857-4.22a.566.566 0 0 0-.581-.565zm2.256-.468c-.018 0-.034 0-.052.002a.6.6 0 0 0-.554.599l-.819 4.688.819 4.688c.03.32.3.569.606.569.018 0 .034 0 .052-.002.33-.02.586-.3.586-.606l.927-4.65-.927-4.688a.614.614 0 0 0-.638-.6zm2.37-.237c-.022 0-.044 0-.066.002a.635.635 0 0 0-.578.636l-.88 4.925.88 4.925c.032.34.31.604.644.604.022 0 .044 0 .066-.002.356-.02.626-.32.626-.638l.996-4.89-.996-4.925a.65.65 0 0 0-.692-.637zm13.29.637c-.297-2.812-2.657-5.003-5.548-5.003-1.012 0-1.958.29-2.76.789-.302.188-.383.398-.386.591v9.95c.003.2.15.37.35.393H21.23c1.532 0 2.77-1.24 2.77-2.77 0-1.528-1.238-2.768-2.77-2.768-.187 0-.37.02-.547.056.06-.29.094-.591.094-.9 0-2.424-1.96-4.338-4.35-4.338zm-13.11 8.35c-.02 0-.04.003-.062.003a.663.663 0 0 0-.614.662l-.94 5.16.94 5.16c.03.36.33.639.676.639.02 0 .04-.003.062-.003.383-.023.674-.35.674-.677l1.065-5.12-1.065-5.16a.685.685 0 0 0-.736-.664zm-2.37 0a.575.575 0 0 0-.524.564l-.83 4.596.83 4.596c.03.306.28.544.564.544a.575.575 0 0 0 .524-.564l.93-4.576-.93-4.596a.585.585 0 0 0-.564-.564z"/>
  </svg>
);

const IconCashApp = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M23.59 3.479A8.337 8.337 0 0 0 20.52.409C18.93-.37 17.16 0 15.65.82L.584 15.886A8.337 8.337 0 0 0 0 20.521a8.337 8.337 0 0 0 3.41 3.07C5 24.37 6.84 24 8.35 23.18L23.416 8.114A8.337 8.337 0 0 0 24 3.479a8.337 8.337 0 0 0-.41-.0z M10.65 15.553l-.734.734a1.65 1.65 0 0 1-2.333-2.333l.734-.734-1.167-1.167-1.1 1.1c-1.65 1.65-1.65 4.317 0 5.967 1.65 1.65 4.317 1.65 5.967 0l1.1-1.1zm2.7-7.106l.734-.734a1.65 1.65 0 0 1 2.333 2.333l-.734.734 1.167 1.167 1.1-1.1c1.65-1.65 1.65-4.317 0-5.967-1.65-1.65-4.317-1.65-5.967 0l-1.1 1.1zm1.1 5.233L13.283 14.847 9.15 10.714l1.167-1.167z"/>
  </svg>
);

const IconVenmo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M19.27 1.044c.44.72.636 1.46.636 2.396 0 2.995-2.558 6.888-4.636 9.624H10.73L8.85 2.3l-4.756.456L6.1 21.956h7.788c3.576-4.668 7.14-12.012 7.14-16.964 0-1.548-.288-2.6-.912-3.456z"/>
  </svg>
);

const IconAppleMusic = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A7.368 7.368 0 0 0 .09 4.822C.05 5.044.023 5.268 0 5.49v13.02c.009.13.019.26.024.39.012.5.135 1.008.286 1.49.496 1.57 1.56 2.59 3.12 3.13.47.166.965.246 1.47.28.41.03.824.04 1.24.04l4.43.003L12 24l4.43-.003c.414-.004.83-.014 1.24-.04.5-.034 1-.115 1.46-.28 1.56-.54 2.63-1.56 3.12-3.13.15-.48.28-.99.29-1.49.005-.13.015-.26.024-.39V5.49a9.04 9.04 0 0 0-.57-3.366zM12 17.77c-2.09 0-3.79-1.7-3.79-3.79s1.7-3.79 3.79-3.79 3.79 1.7 3.79 3.79-1.7 3.79-3.79 3.79zm5.68-9.32l-6.97 2.89V6.72c0-.73.47-1.38 1.16-1.62l5.81-2.13v5.48z"/>
  </svg>
);

const IconGitLab = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="m23.6 9.93-1.2-3.68L20.2.99a.55.55 0 0 0-1.04 0L17 6.25H7L4.84.99a.55.55 0 0 0-1.04 0L1.6 6.25.4 9.93a1.1 1.1 0 0 0 .4 1.23L12 20l11.2-8.84a1.1 1.1 0 0 0 .4-1.23"/>
  </svg>
);

const IconVK = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C5.29 11.9 4.93 9.728 4.93 9.253c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.87c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.743c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.744-.576.744z"/>
  </svg>
);

const IconLinktree = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.648.728 1.134 1.376 1.134.242 0 .404-.08.566-.162l4.41-2.594v3.89l-4.654 2.755c-.16.08-.322.162-.482.162-.648 0-1.214-.566-1.214-1.214 0-.162.08-.404.16-.566L7.873 15.9zM12 9.219l4.246-2.43v-.08c.08-.244.16-.486.16-.73 0-.73-.566-1.296-1.296-1.296-.162 0-.404.08-.566.162L12 6.867zM12 0L6.328 3.294 12 6.867l5.672-3.573zM12 9.219l-5.672 3.49.08 3.248L12 12.38zM12 12.38l5.672 3.573-.08-3.248-5.592-3.49z"/>
  </svg>
);

const IconBluesky = () => (
  <svg viewBox="0 0 600 530" className="h-5 w-5 fill-current">
    <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"/>
  </svg>
);

const IconThreads = () => (
  <svg viewBox="0 0 192 192" className="h-5 w-5 fill-current">
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.232c8.25.053 14.476 2.452 18.502 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.05-14.127 5.177-6.6 8.452-15.153 9.898-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.941c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.643 32.788 28.08 19.882 44.485 13.224 67.315 13.001 96c.223 28.685 6.88 51.515 19.787 67.92 14.504 18.437 36.094 27.885 64.196 28.08h.113c24.86-.17 42.237-6.68 56.59-21.02 18.91-18.894 18.345-42.591 12.131-57.175-4.637-10.812-13.568-19.512-24.281-24.817zM97.953 132.6c-10.444.571-21.302-4.103-27.024-11.856a14.637 14.637 0 0 1-.594-.905c-2.88-4.734-3.965-10.512-3.666-16.32.522-9.792 7.897-16.59 20.8-17.33a73.9 73.9 0 0 1 4.225-.12c6.645 0 13.093.631 19.233 1.888-2.268 28.456-13.5 43.428-12.974 44.643z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconKick = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M2 2h6v6.5l4-6.5h6l-5 8 5 8h-6l-4-6.5V22H2V2z"/>
  </svg>
);

const IconPinterest = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const IconPatreon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z"/>
  </svg>
);

const IconKofi = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.038-.029.928.949.837.948 1.524.104l.566-.73c.606-.742 1.15-1.191 1.857-.924.706.266.706 1.22.706 1.22s.214.977-.133 2.114zm7.734.029c-.118.748-.715 1.402-1.605 1.402h-1.93v-5.808h1.93c.886 0 1.487.646 1.605 1.402-.238.084-.367.227-.367.494v.517c0 .263.129.41.367.493v1.5z"/>
  </svg>
);

const IconBitcoin = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
  </svg>
);

const IconEthereum = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
  </svg>
);

const IconEmail = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const IconRoblox = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M3.408 0L0 20.656 20.656 24 24 3.348zm11.83 14.36l-5.744-1.336 1.34-5.744 5.744 1.34z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────
// Platform Definitions
// ─────────────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  { id: "snapchat",    name: "Snapchat",     color: "#000000", bg: "#FFFC00", prefix: "https://snapchat.com/add/",      displayPrefix: "snapchat.com/add/",      placeholder: "yourname",          textPlaceholder: "Your Snapcode or username",   hasAsset: false, inlineSvg: <IconSnapchat /> },
  { id: "youtube",    name: "YouTube",      color: "#ffffff", bg: "#FF0000", prefix: "https://youtube.com/@",          displayPrefix: "youtube.com/@",          placeholder: "handle",            textPlaceholder: "Full channel URL",            hasAsset: true },
  { id: "discord",    name: "Discord",      color: "#ffffff", bg: "#5865F2", prefix: "https://discord.com/users/",     displayPrefix: "discord.gg/",            placeholder: "invite or ID",      textPlaceholder: "Discord tag e.g. user#1234",  hasAsset: false, inlineSvg: <IconDiscord /> },
  { id: "spotify",    name: "Spotify",      color: "#000000", bg: "#1DB954", prefix: "https://open.spotify.com/user/", displayPrefix: "open.spotify.com/user/", placeholder: "username",          textPlaceholder: "Full Spotify profile URL",    hasAsset: true },
  { id: "instagram",  name: "Instagram",    color: "#ffffff", bg: "#E1306C", prefix: "https://instagram.com/",         displayPrefix: "instagram.com/",         placeholder: "username",          textPlaceholder: "Full Instagram profile URL",  hasAsset: true },
  { id: "twitter",    name: "X / Twitter",  color: "#ffffff", bg: "#000000", prefix: "https://x.com/",                 displayPrefix: "x.com/",                 placeholder: "handle",            textPlaceholder: "Your @handle or profile URL", hasAsset: true },
  { id: "tiktok",     name: "TikTok",       color: "#ffffff", bg: "#010101", prefix: "https://tiktok.com/@",           displayPrefix: "tiktok.com/@",           placeholder: "username",          textPlaceholder: "Full TikTok profile URL",     hasAsset: true },
  { id: "telegram",   name: "Telegram",     color: "#ffffff", bg: "#26A5E4", prefix: "https://t.me/",                  displayPrefix: "t.me/",                  placeholder: "username",          textPlaceholder: "Your Telegram handle",        hasAsset: false, inlineSvg: <IconTelegram /> },
  { id: "soundcloud", name: "SoundCloud",   color: "#ffffff", bg: "#FF5500", prefix: "https://soundcloud.com/",        displayPrefix: "soundcloud.com/",        placeholder: "username",          textPlaceholder: "Full SoundCloud URL",         hasAsset: false, inlineSvg: <IconSoundCloud /> },
  { id: "paypal",     name: "PayPal",       color: "#ffffff", bg: "#003087", prefix: "https://paypal.me/",             displayPrefix: "paypal.me/",             placeholder: "username",          textPlaceholder: "Your PayPal.me link",         hasAsset: true },
  { id: "github",     name: "GitHub",       color: "#ffffff", bg: "#24292e", prefix: "https://github.com/",            displayPrefix: "github.com/",            placeholder: "username",          textPlaceholder: "Full GitHub profile URL",     hasAsset: true },
  { id: "roblox",     name: "Roblox",       color: "#ffffff", bg: "#E00B24", prefix: "https://roblox.com/users/",      displayPrefix: "roblox.com/users/",      placeholder: "user ID",           textPlaceholder: "Your Roblox profile URL",     hasAsset: false, inlineSvg: <IconRoblox /> },
  { id: "cashapp",    name: "Cash App",     color: "#ffffff", bg: "#00D64F", prefix: "https://cash.app/$",             displayPrefix: "cash.app/$",             placeholder: "cashtag",           textPlaceholder: "Your $cashtag",               hasAsset: false, inlineSvg: <IconCashApp /> },
  { id: "venmo",      name: "Venmo",        color: "#ffffff", bg: "#3D95CE", prefix: "https://venmo.com/",             displayPrefix: "venmo.com/",             placeholder: "username",          textPlaceholder: "Your Venmo username",         hasAsset: false, inlineSvg: <IconVenmo /> },
  { id: "playstation",name: "PlayStation",  color: "#ffffff", bg: "#003087", prefix: "https://psnprofiles.com/",       displayPrefix: "psnprofiles.com/",       placeholder: "PSN ID",            textPlaceholder: "Your PSN ID",                 hasAsset: true },
  { id: "xbox",       name: "Xbox",         color: "#ffffff", bg: "#107C10", prefix: "https://xboxgamertag.com/",      displayPrefix: "xboxgamertag.com/",      placeholder: "gamertag",          textPlaceholder: "Your Xbox gamertag",          hasAsset: true },
  { id: "applemusic", name: "Apple Music",  color: "#ffffff", bg: "#FA233B", prefix: "https://music.apple.com/",       displayPrefix: "music.apple.com/",       placeholder: "profile URL",       textPlaceholder: "Full Apple Music profile URL",hasAsset: false, inlineSvg: <IconAppleMusic /> },
  { id: "gitlab",     name: "GitLab",       color: "#ffffff", bg: "#FC6D26", prefix: "https://gitlab.com/",            displayPrefix: "gitlab.com/",            placeholder: "username",          textPlaceholder: "Full GitLab profile URL",     hasAsset: false, inlineSvg: <IconGitLab /> },
  { id: "twitch",     name: "Twitch",       color: "#ffffff", bg: "#9146FF", prefix: "https://twitch.tv/",             displayPrefix: "twitch.tv/",             placeholder: "username",          textPlaceholder: "Full Twitch channel URL",     hasAsset: true },
  { id: "reddit",     name: "Reddit",       color: "#ffffff", bg: "#FF4500", prefix: "https://reddit.com/u/",          displayPrefix: "reddit.com/u/",          placeholder: "username",          textPlaceholder: "Full Reddit profile URL",     hasAsset: true },
  { id: "vk",         name: "VK",           color: "#ffffff", bg: "#0077FF", prefix: "https://vk.com/",                displayPrefix: "vk.com/",                placeholder: "username",          textPlaceholder: "Full VK profile URL",         hasAsset: false, inlineSvg: <IconVK /> },
  { id: "linktree",   name: "Linktree",     color: "#ffffff", bg: "#43E55E", prefix: "https://linktr.ee/",             displayPrefix: "linktr.ee/",             placeholder: "username",          textPlaceholder: "Full Linktree URL",           hasAsset: false, inlineSvg: <IconLinktree /> },
  { id: "bluesky",    name: "Bluesky",      color: "#ffffff", bg: "#0085FF", prefix: "https://bsky.app/profile/",     displayPrefix: "bsky.app/profile/",      placeholder: "handle.bsky.social","textPlaceholder": "Your Bluesky handle",      hasAsset: false, inlineSvg: <IconBluesky /> },
  { id: "threads",    name: "Threads",      color: "#ffffff", bg: "#101010", prefix: "https://threads.net/@",          displayPrefix: "threads.net/@",          placeholder: "username",          textPlaceholder: "Full Threads profile URL",    hasAsset: false, inlineSvg: <IconThreads /> },
  { id: "linkedin",   name: "LinkedIn",     color: "#ffffff", bg: "#0A66C2", prefix: "https://linkedin.com/in/",       displayPrefix: "linkedin.com/in/",       placeholder: "username",          textPlaceholder: "Full LinkedIn profile URL",   hasAsset: false, inlineSvg: <IconLinkedIn /> },
  { id: "steam",      name: "Steam",        color: "#ffffff", bg: "#1b2838", prefix: "https://steamcommunity.com/id/", displayPrefix: "steamcommunity.com/id/", placeholder: "username",          textPlaceholder: "Full Steam profile URL",      hasAsset: true },
  { id: "kick",       name: "Kick",         color: "#000000", bg: "#53FC18", prefix: "https://kick.com/",              displayPrefix: "kick.com/",              placeholder: "username",          textPlaceholder: "Full Kick channel URL",        hasAsset: false, inlineSvg: <IconKick /> },
  { id: "pinterest",  name: "Pinterest",    color: "#ffffff", bg: "#E60023", prefix: "https://pinterest.com/",         displayPrefix: "pinterest.com/",         placeholder: "username",          textPlaceholder: "Full Pinterest profile URL",  hasAsset: false, inlineSvg: <IconPinterest /> },
  { id: "facebook",   name: "Facebook",     color: "#ffffff", bg: "#1877F2", prefix: "https://facebook.com/",          displayPrefix: "facebook.com/",          placeholder: "username",          textPlaceholder: "Full Facebook profile URL",   hasAsset: true },
  { id: "patreon",    name: "Patreon",      color: "#ffffff", bg: "#FF424D", prefix: "https://patreon.com/",           displayPrefix: "patreon.com/",           placeholder: "username",          textPlaceholder: "Full Patreon page URL",        hasAsset: false, inlineSvg: <IconPatreon /> },
  { id: "kofi",       name: "Ko-fi",        color: "#ffffff", bg: "#FF5E5B", prefix: "https://ko-fi.com/",             displayPrefix: "ko-fi.com/",             placeholder: "username",          textPlaceholder: "Full Ko-fi profile URL",      hasAsset: false, inlineSvg: <IconKofi /> },
  { id: "bitcoin",    name: "Bitcoin",      color: "#ffffff", bg: "#F7931A", prefix: "",                               displayPrefix: "",                       placeholder: "wallet address",    textPlaceholder: "Your BTC wallet address",     hasAsset: false, inlineSvg: <IconBitcoin /> },
  { id: "ethereum",   name: "Ethereum",     color: "#ffffff", bg: "#627EEA", prefix: "",                               displayPrefix: "",                       placeholder: "wallet address",    textPlaceholder: "Your ETH wallet address",     hasAsset: false, inlineSvg: <IconEthereum /> },
  { id: "email",      name: "Email",        color: "#ffffff", bg: "#EA4335", prefix: "mailto:",                        displayPrefix: "mailto:",                placeholder: "your@email.com",    textPlaceholder: "Your email address",          hasAsset: false, inlineSvg: <IconEmail /> },
  { id: "custom",     name: "Custom URL",   color: "#ffffff", bg: "#3a3a3a", prefix: "",                               displayPrefix: "",                       placeholder: "https://...",       textPlaceholder: "Any URL or text to copy",     hasAsset: false },
];

// ─────────────────────────────────────────────────────────────────────
// Platform Icon Renderer
// ─────────────────────────────────────────────────────────────────────

function PlatformIcon({ platform, size = "md" }: { platform: Platform; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  if (platform.id === "custom") {
    return <Globe2 className={s} />;
  }
  if (platform.hasAsset) {
    return (
      <img
        src={`/assets/images/connections/${platform.id}.svg`}
        alt={platform.name}
        className={`${s} object-contain`}
        style={{ filter: platform.id === "github" || platform.id === "twitter" ? "brightness(10)" : undefined }}
      />
    );
  }
  return (
    <span className={s} style={{ color: platform.color }}>
      {platform.inlineSvg}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Add Link Dialog
// ─────────────────────────────────────────────────────────────────────

function PlatformDialog({
  platform,
  existingLink,
  onAdd,
  onClose,
}: {
  platform: Platform;
  existingLink?: CustomLink;
  onAdd: (link: CustomLink) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"link" | "text">(existingLink?.linkType ?? "link");
  const [linkValue, setLinkValue] = useState(() => {
    if (existingLink?.linkType === "link") {
      return existingLink.url.replace(platform.prefix, "");
    }
    return "";
  });
  const [textValue, setTextValue] = useState(() => {
    if (existingLink?.linkType === "text") return existingLink.url;
    return "";
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const isCrypto = platform.id === "bitcoin" || platform.id === "ethereum";
  const noPrefix = !platform.prefix || platform.id === "custom";

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [tab]);

  const handleSubmit = () => {
    if (tab === "link") {
      const raw = linkValue.trim();
      if (!raw) return;
      const url = noPrefix ? (raw.startsWith("http") ? raw : `https://${raw}`) : `${platform.prefix}${raw}`;
      onAdd({
        id: existingLink?.id ?? Date.now().toString(),
        title: platform.name,
        url,
        icon: "web",
        iconType: platform.id,
        linkType: "link",
        prefix: platform.prefix,
        active: existingLink?.active ?? true,
      });
    } else {
      const raw = textValue.trim();
      if (!raw) return;
      onAdd({
        id: existingLink?.id ?? Date.now().toString(),
        title: platform.name,
        url: raw,
        icon: "web",
        iconType: platform.id,
        linkType: "text",
        active: existingLink?.active ?? true,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative z-10 w-full max-w-md rounded-[28px] border border-white/[0.09] bg-[#0D0D0D] shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Subtle top glow from platform color */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-20"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${platform.bg}, transparent 70%)` }}
        />

        {/* Header */}
        <div className="relative flex items-center gap-4 px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg"
            style={{ background: platform.bg }}
          >
            <PlatformIcon platform={platform} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white">{platform.name}</h2>
            <p className="mt-0.5 text-xs text-white/45">Add to your public profile</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        {!isCrypto && (
          <div className="relative mx-6 mt-5 flex rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1">
            {/* Sliding pill */}
            <motion.div
              layout
              layoutId="tab-pill"
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="absolute inset-1 w-[calc(50%-4px)] rounded-xl"
              style={{
                background: "rgba(255,255,255,0.09)",
                x: tab === "text" ? "calc(100% + 0px)" : 0,
              }}
            />
            {(["link", "text"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors duration-150 ${
                  tab === t ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "link" ? (
                  <>
                    <ExternalLink className="h-3.5 w-3.5" />
                    Link — opens in new tab
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Text — copies to clipboard
                  </>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "link" ? (
              <motion.div
                key="link-tab"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  {noPrefix || isCrypto ? "Value" : "Your " + platform.name + " handle"}
                </p>
                {noPrefix || isCrypto ? (
                  <input
                    ref={inputRef}
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={platform.placeholder}
                    className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-colors"
                  />
                ) : (
                  <div className="flex h-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] focus-within:border-white/20 transition-colors">
                    <span className="flex items-center pl-4 pr-2 text-xs text-white/35 whitespace-nowrap select-none font-mono">
                      {platform.displayPrefix}
                    </span>
                    <input
                      ref={inputRef}
                      value={linkValue}
                      onChange={(e) => setLinkValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder={platform.placeholder}
                      className="min-w-0 flex-1 bg-transparent pr-4 text-sm text-white placeholder:text-white/25 outline-none"
                    />
                  </div>
                )}
                {linkValue && !noPrefix && !isCrypto && (
                  <p className="mt-2 text-[11px] text-white/30 font-mono truncate">
                    → {platform.prefix}{linkValue}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="text-tab"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Text to copy
                </p>
                <div className="flex h-12 items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 focus-within:border-white/20 transition-colors">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: platform.bg }}
                  >
                    <PlatformIcon platform={platform} size="sm" />
                  </div>
                  <input
                    ref={tab === "text" ? inputRef : undefined}
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={platform.textPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/30">
                  Visitors will click to copy this to their clipboard.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-sm font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={tab === "link" ? !linkValue.trim() : !textValue.trim()}
            className="flex-1 h-11 rounded-2xl bg-white text-sm font-bold text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            style={
              !(tab === "link" ? !linkValue.trim() : !textValue.trim())
                ? { boxShadow: `0 0 24px rgba(255,255,255,0.15)` }
                : undefined
            }
          >
            {existingLink ? "Update" : "Add link"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Added Link Card
// ─────────────────────────────────────────────────────────────────────

function LinkCard({
  link,
  platform,
  onDelete,
  onToggle,
  onEdit,
}: {
  link: CustomLink;
  platform: Platform | undefined;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const pl = platform ?? PLATFORMS.find((p) => p.id === "custom")!;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`group rounded-[22px] border p-4 transition-all duration-200 ${
        link.active
          ? "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04]"
          : "border-white/[0.04] bg-black/10 opacity-50"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md"
          style={{ background: pl.bg }}
        >
          <PlatformIcon platform={pl} size="md" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{link.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                link.linkType === "link"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {link.linkType === "link" ? "↗ Link" : "⎘ Copy"}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-white/35 font-mono">{link.url}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {link.linkType === "link" && (
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/35 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
              title="Open link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/35 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/35 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-150"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Toggle row */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={onToggle}
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-150 ${
            link.active
              ? "bg-white/10 text-white"
              : "bg-white/[0.05] text-white/35"
          }`}
        >
          {link.active ? "● Visible" : "○ Hidden"}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────

export default function LinksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<CustomLink[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [editingLink, setEditingLink] = useState<CustomLink | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          router.push("/signin");
          return;
        }
        if (Array.isArray(data.user.custom_links) && data.user.custom_links.length > 0) {
          setLinks(data.user.custom_links);
        }
      } catch {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const openAdd = (platform: Platform) => {
    setEditingLink(undefined);
    setSelectedPlatform(platform);
  };

  const openEdit = (link: CustomLink) => {
    const pl = PLATFORMS.find((p) => p.id === link.iconType) ?? PLATFORMS.find((p) => p.id === "custom")!;
    setEditingLink(link);
    setSelectedPlatform(pl);
  };

  const handleAdd = (link: CustomLink) => {
    if (editingLink) {
      setLinks((prev) => prev.map((l) => (l.id === link.id ? link : l)));
    } else {
      setLinks((prev) => [...prev, link]);
    }
    setSaved(false);
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setSaved(false);
  };

  const toggleLink = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
    setSaved(false);
  };

  const saveLinks = async () => {
    try {
      setSaving(true);
      setSaved(false);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_links: links }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLoading label="Loading links" />;

  const activeCount = links.filter((l) => l.active).length;

  return (
    <>
      <DashboardShell
        eyebrow="Links"
        title="Social link hub"
        description="Connect your socials. Visitors can open links or copy handles directly from your profile."
        action={
          <Button
            onClick={saveLinks}
            disabled={saving}
            className="h-11 rounded-2xl bg-white px-6 text-sm font-bold text-black hover:bg-white/85 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
          </Button>
        }
      >
        {/* Platform Picker Panel */}
        <Panel className="mb-5 overflow-hidden">
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center gap-2.5 mb-1">
              <Link2 className="h-4 w-4 text-white/60" />
              <h2 className="text-sm font-bold text-white">Link your social media profiles.</h2>
            </div>
            <p className="text-xs text-white/35">Pick a social media to add to your profile.</p>
          </div>

          {/* Icon grid */}
          <div className="px-4 pb-5 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((platform) => {
                const alreadyAdded = links.some((l) => l.iconType === platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => openAdd(platform)}
                    title={platform.name}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 hover:scale-110 active:scale-95"
                    style={{ background: platform.bg }}
                  >
                    <PlatformIcon platform={platform} size="sm" />
                    {alreadyAdded && (
                      <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-black" />
                      </div>
                    )}
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                      <div className="whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#111] px-2.5 py-1 text-[10px] font-semibold text-white shadow-xl">
                        {platform.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Added Links Panel */}
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Your connections</h2>
              <p className="mt-0.5 text-xs text-white/40">
                {activeCount} active · {links.length} total
              </p>
            </div>
            {links.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 inline-block" /> link opens tab
                <span className="mx-1 opacity-30">·</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" /> text copies
              </div>
            )}
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] py-14 text-center">
              <Globe2 className="h-8 w-8 text-white/15 mb-3" />
              <p className="text-sm font-semibold text-white/30">No links yet</p>
              <p className="mt-1 text-xs text-white/20">Pick a platform above to get started</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <AnimatePresence>
                {links.map((link) => {
                  const platform = PLATFORMS.find((p) => p.id === link.iconType);
                  return (
                    <LinkCard
                      key={link.id}
                      link={link}
                      platform={platform}
                      onDelete={() => deleteLink(link.id)}
                      onToggle={() => toggleLink(link.id)}
                      onEdit={() => openEdit(link)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Panel>
      </DashboardShell>

      {/* Dialog Portal */}
      <AnimatePresence>
        {selectedPlatform && (
          <PlatformDialog
            platform={selectedPlatform}
            existingLink={editingLink}
            onAdd={handleAdd}
            onClose={() => {
              setSelectedPlatform(null);
              setEditingLink(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

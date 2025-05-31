
import React from 'react';

export const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
);

export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export const BranchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75V3.75m0 12.75l-2.25-2.25M10.5 16.5l2.25-2.25m0 0l2.25 2.25m-2.25-2.25l2.25-2.25M10.5 12l2.25 2.25m-2.25-2.25L8.25 9.75M12 3.75H7.5A2.25 2.25 0 005.25 6v10.5a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0018.75 16.5V6a2.25 2.25 0 00-2.25-2.25H12z" />
  </svg>
);

export const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5 0l-4.5 16.5" />
  </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.056 15.056 0 01-4.5 0M12 18c-3.75 0-6.25-1.036-6.25-2.625s2.5-2.625 6.25-2.625S18.25 13.811 18.25 15.375c0 1.589-2.5 2.625-6.25 2.625z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 11.25A2.625 2.625 0 0012 8.625a2.625 2.625 0 002.25 2.625M9.75 11.25A2.625 2.625 0 0112 13.875a2.625 2.625 0 012.25-2.625M9.75 11.25v9M14.25 11.25v9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a.75.75 0 01-.75-.75V18a.75.75 0 011.5 0v2.25A.75.75 0 0112 21z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a2.25 2.25 0 012.25 2.25v.75A2.25 2.25 0 0112 9H9.75A2.25 2.25 0 017.5 6.75V6A2.25 2.25 0 019.75 3.75H12z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

export const IssueOpenedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const BugAntIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 2.175L12 4.125m0 0L13.95 2.175M12 4.125V6.75m8.415 1.585L18 10.5m.415-.165A7.501 7.501 0 0012 6.75c-2.098 0-3.998.859-5.415 2.25m10.83 0c.326-.202.698-.338 1.085-.415m0 0A7.5 7.5 0 0012 6.75c-2.098 0-3.998.859-5.415 2.25m10.83 0L18 10.5m-2.932 3.068a7.519 7.519 0 01-1.085.415m0 0c.326.202.698.338 1.085.415m-1.085-.415c-.326.202-.698.338-1.085.415m0 0A7.5 7.5 0 0112 17.25c-2.098 0-3.998-.859-5.415-2.25m10.83 0c.326-.202.698-.338 1.085-.415m0 0l2.415 2.415m-4.252-5.483L12 10.5m0 0L9.585 8.085M12 10.5l2.415 2.415M12 10.5V6.75m5.415 6.085l-2.415-2.415m0 0L12 10.5m2.415 2.415L12 15.375M12 15.375L9.585 12.96m0 0L7.17 15.375m2.415-2.415L12 10.5m-2.415 2.415L12 15.375M4.035 13.585L6 11.25m.415.165A7.501 7.501 0 0112 17.25c2.098 0 3.998-.859 5.415-2.25M19.965 10.415L18 12.75m-.415-.165A7.501 7.501 0 0012 17.25c-2.098 0-3.998-.859-5.415-2.25m0 0L4.035 13.585m1.98 1.98L6 17.25M12 21.75V19.5m0 0V6.75" />
  </svg>
);

export const ShieldExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.128 3.33A11.956 11.956 0 0012 2.25c2.995 0 5.718.943 7.962 2.536m-15.924 0A11.956 11.956 0 0112 2.25c-2.995 0-5.718.943-7.962 2.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v3.75m0-6a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V6a.75.75 0 01.75-.75m0 3.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3.75m0 3.75a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12m1.5 0H12m-6.072-.266A11.932 11.932 0 012.25 12c0-3.095 1.198-5.901 3.174-7.984m13.102 0A11.932 11.932 0 0121.75 12c0 3.095-1.198 5.901-3.174 7.984" />
  </svg>
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.25-1.35M18.75 4.97l-2.25 1.35m0 0A48.255 48.255 0 0112 9c-2.291 0-4.545-.16-6.75-.47m13.5 0c1.01.143 2.01.317 3 .52M6.75 6.27H4.5L2.25 4.97M6.75 6.27L4.5 7.62M12 9V3.75m0 5.25c1.472 0 2.882-.265 4.185-.75M12 9c-1.472 0-2.882-.265-4.185-.75" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l2.496-3.03c.52-.634.166-1.623-.749-1.623H10.5c-.405 0-.78.258-.938.622l-1.088 2.539a1.875 1.875 0 01-2.855.416l-3.06-2.496a1.875 1.875 0 00-2.855.416l-.862 1.035a.75.75 0 000 1.06L11.42 15.17z" />
  </svg>
);

export const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);


export const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const InformationCircleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const ExclamationTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const CheckSquareIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5h16.5V3.75H3.75z" />
    </svg>
);


    
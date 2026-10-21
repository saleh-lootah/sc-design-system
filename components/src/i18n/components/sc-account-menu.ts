import { defineStrings } from '../define';

/** sc-account-menu (v2): the signed-in account menu and the notifications button. */
export default defineStrings({
  en: {
    accountLabel: 'Account:',
    accountActingFor: 'Acting for: {name}',
    accountProfile: 'Profile',
    accountSettings: 'Settings',
    accountRepresentation: 'Change who you act for',
    accountSignOut: 'Sign out',
    accountNotifications: 'Notifications',
    accountUnread: 'Notifications, {count} unread',
  },
  ar: {
    accountLabel: 'الحساب:',
    accountActingFor: 'بالنيابة عن: {name}',
    accountProfile: 'الملف الشخصي',
    accountSettings: 'الإعدادات',
    accountRepresentation: 'تغيير الجهة التي تمثلها',
    accountSignOut: 'تسجيل الخروج',
    accountNotifications: 'الإشعارات',
    accountUnread: 'الإشعارات، {count} غير مقروءة',
  },
});

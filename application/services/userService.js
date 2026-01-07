import connection from "../../frameworks/database/postgress/connection.js";
import queryHelper from "../../utils/queryHelper.js";

export default class userService {
  constructor() {
    this.db = new queryHelper(connection.sequelize);
  }

  async authMe(idUser) {
    const data = await this.db.select({
      query: `select u.username, u.password, u.id, p.nama, p.nik, p.tempat_lahir, p.tgl_lahir, p.alamat, msk.nama as status_karyawan from users u left join pegawai p on u.id_pegawai = p.id left join master_status_karyawan msk on msk.id = p.status_karyawan where u.id = :id`,
      replacements: {
        id: idUser,
      },
    });
    const apk = await this.getApk(idUser);
    const role = await this.getRole(idUser);
    const permission = await this.getPermission(role);
    const menu = await this.getMenu(permission);
    return {
      data: {
        apk,
        role,
        permission,
        menu,
        user: {
          username: data[0].username,
          nama: data[0].nama,
          nik: data[0].nik,
          alamat: data[0].alamat,
          tempat_lahir: data[0].tempat_lahir,
          tgl_lahir: data[0].tgl_lahir,
        },
      },
    };
  }

  async getApk(idUser) {
    const data = this.db.select({
      query: `select a.icon, a.title, a.link, a.link_api from user_aplikasi ua left join aplikasi a on ua.id_aplikasi =  a.id where ua.id_user = :id_user`,
      replacements: {
        id_user: idUser,
      },
    });
    return data;
  }

  async getRole(idUser) {
    const data = this.db.select({
      query: `select r.nama  as role, r.id from user_roles ur left join roles r on ur.id_role = r.id where ur.id_user = :id_user`,
      replacements: {
        id_user: idUser,
      },
    });
    return data;
  }

  async getPermission(roles) {
    let id_role = roles.map((r) => r.id);
    if (id_role.length > 0) {
      const data = this.db.select({
        query: `select p.id, p.nama as permission from role_permissions rp left join permissions p on rp.id_permission = p.id where id_role in (:id_role)`,
        replacements: {
          id_role: id_role,
        },
      });
      return data;
    }
    return [];
  }

  async getMenu(permissions) {
    let id_permission = permissions.map((r) => r.id);
    if (id_permission.length > 0) {
      const data = await this.getDataMenu(id_permission);
      return data;
    }
    return [];
  }

  async getDataMenu(id_permission) {
    const data = this.db.query({
      query: `
      SELECT url as href, icon, title, master_menu.id, p.nama as name_permission, id_permission, parent_id FROM master_menu LEFT JOIN permissions p on p.id = master_menu.id_permission  where parent_id is null AND id_permission in (:id_permission) ORDER BY order_menu ASC
    `,
      replacements: { id_permission },
    });

    let menu = [];
    for (let i of data) {
      menu.push({
        id_permission: i.id_permission,
        name_permission: i.name_permission,
        title: i.title,
        icon: i.icon,
        href: i.href,
        children: await this.getMenuChildren(i.id),
      });
    }
    return menu;
  }

  async getMenuChildren(parent_id) {
    const data = this.db.query({
      query: `
      SELECT url as href, icon, title, master_menu.id, id_permission, p.nama as name_permission FROM master_menu LEFT JOIN permissions p on p.id = master_menu.id_permission where parent_id = :parent_id  order BY order_menu ASC
    `,
      replacements: { parent_id },
    });

    let menuChildren = [];
    for (let i of data) {
      menuChildren.push({
        id_permission: i.id_permission,
        name_permission: i.name_permission,
        title: i.title,
        icon: i.icon,
        href: i.href,
        children: await this.getMenuChildren(i.id),
      });
    }
    return menuChildren;
  }

  async permitMe(idUser, accessPermission) {
    const roles = await this.getRole(idUser);
    const permission = await this.getPermission(roles);
    if (permission.length > 0) {
      let isPermit = permission.find((item) => {
        item.name == accessPermission;
      });
      return { data: isPermit ? true : false };
    }
    return { data: false };
  }
}

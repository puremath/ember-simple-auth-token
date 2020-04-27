import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'ember-get-config';

/**
  Authorizer Mixin that works with token-based authentication like JWT by sending the `token` properties from the session in the `Authorization` header.

  @class TokenAuthorizer
  @module ember-simple-auth-token/mixins/token-authorizer
  @extends Ember.Mixin
*/
export default Mixin.create(DataAdapterMixin, {
  session: inject('session'),

  /**
    @method init
  */
  init() {
    this._super(...arguments);
    const conf = config['ember-simple-auth-token'] || {};
    this.tokenPropertyName = conf.tokenPropertyName || 'token';
    this.authorizationHeaderName = conf.authorizationHeaderName || 'Authorization';
    this.authorizationPrefix = conf.authorizationPrefix === '' ? '' : conf.authorizationPrefix || 'Bearer ';
  },

  /**
    Adds the `Authorization` header using the header computed propertiy.

    ```
    Authorization: Bearer <token>
    ```
  */
  headers: computedHeadersFactory( function() {
    const data = get(this, 'session.data.authenticated');
    const token = get(data, this.get('tokenPropertyName'));
    const prefix = this.get('authorizationPrefix');
    const header = this.get('authorizationHeaderName');
    const headers = {};

    if (this.get('session.isAuthenticated') && !isEmpty(token)) {
      headers[header] = `${prefix}${token}`;
    }

    return headers;
  })
});

function computedHeadersFactory(fn) {
  const conf = config['ember-simple-auth-token'] || {};
  const tokenPropertyName = conf.tokenPropertyName || 'token';
  return computed(`session.data.authenticated.${tokenPropertyName}`, fn);
}

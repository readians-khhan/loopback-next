// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository-tests
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  belongsTo,
  BelongsToAccessor,
  Entity,
  EntityCrudRepository,
  hasMany,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  hasOne,
  HasOneRepositoryFactory,
  model,
  property,
} from '@loopback/repository';
import {MixedIdType} from '../../../../helpers.repository-tests';
import {Address, AddressWithRelations} from './address.model';
import {Order, OrderWithRelations} from './order.model';
import {Seller, SellerWithRelations} from './seller.model';

@model()
export class Customer extends Entity {
  @property({
    id: true,
    generated: true,
    useDefaltIdType: true,
  })
  id: MixedIdType;

  @property({
    type: 'string',
  })
  name: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasMany(() => Seller, {
    through: {
      model: () => Order,
    },
  })
  sellers: Seller[];

  @hasOne(() => Address)
  address: Address;

  @hasMany(() => Customer, {keyTo: 'parentId'})
  customers?: Customer[];

  @belongsTo(() => Customer)
  parentId?: MixedIdType;
}

export interface CustomerRelations {
  address?: AddressWithRelations;
  orders?: OrderWithRelations[];
  sellers?: SellerWithRelations[];
  customers?: CustomerWithRelations[];
  parentCustomer?: CustomerWithRelations;
}

export type CustomerWithRelations = Customer & CustomerRelations;

export interface CustomerRepository
  extends EntityCrudRepository<Customer, typeof Customer.prototype.id> {
  // define additional members like relation methods here
  address: HasOneRepositoryFactory<Address, MixedIdType>;
  orders: HasManyRepositoryFactory<Order, MixedIdType>;
  sellers: HasManyThroughRepositoryFactory<
    Seller,
    typeof Seller.prototype.id,
    Order,
    typeof Customer.prototype.id
  >;
  customers: HasManyRepositoryFactory<Customer, MixedIdType>;
  parent: BelongsToAccessor<Customer, MixedIdType>;
}

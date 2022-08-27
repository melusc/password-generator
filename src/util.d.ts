declare module 'node:util' {
	type Flag<Type extends FlagType, Default, Multiple = false> = {
		readonly type: Type;
		readonly multiple?: Multiple;
		readonly short?: string;
	};

	type StringFlag = Flag<'string', string> | Flag<'string', string[], true>;
	type BooleanFlag =
		| Flag<'boolean', boolean>
		| Flag<'boolean', boolean[], true>;
	type AnyFlag = StringFlag | BooleanFlag;
	type AnyFlags = Record<string, AnyFlag>;

	type TypedFlag<Flag extends AnyFlag> = Flag extends {type: 'string'}
		? string
		: Flag extends {type: 'boolean'}
			? boolean
			: unknown;

	type TypedFlags<Flags extends AnyFlags> = {
		[F in keyof Flags]: Flags[F] extends {multiple: true}
			? Array<TypedFlag<Flags[F]>> | undefined
			: TypedFlag<Flags[F]> | undefined;
	};

	type Options<Flags extends AnyFlags, Strict extends boolean> = {
		/**
		Define argument flags.

		The key is the flag name in camel-case and the value is an object with any of:

		- `type`: Type of value. (Possible values: `string` `boolean` `number`)
		- `alias`: Usually used to define a short flag alias.
		- `default`: Default value when the flag is not specified.
		- `isRequired`: Determine if the flag is required.
			If it's only known at runtime whether the flag is required or not you can pass a Function instead of a boolean, which based on the given flags and other non-flag arguments should decide if the flag is required.
		- `isMultiple`: Indicates a flag can be set multiple times. Values are turned into an array. (Default: false)
			Multiple values are provided by specifying the flag multiple times, for example, `$ foo -u rainbow -u cat`. Space- or comma-separated values are *not* supported.

		Note that flags are always defined using a camel-case key (`myKey`), but will match arguments in kebab-case (`--my-key`).

		@example
		```
		flags: {
			unicorn: {
				type: 'string',
				alias: 'u',
				multiple: true,
			}
		}
		```
		*/
		readonly options?: Flags;

		/**
		Custom arguments object.

		@default process.argv.slice(2)
		*/
		readonly args?: readonly string[];

		/**
		Whether to allow unknown flags or not.

		@default true
		*/
		readonly strict?: Strict;

		/**
		Whether this command accepts positional arguments.

		@default false if strict is true, otherwise true.
		*/
		readonly allowPositionals?: boolean;
	};

	type Result<Flags extends AnyFlags, Strict extends boolean = true> = {
		values: Strict extends true
			? TypedFlags<Flags>
			: TypedFlags<Flags> & Record<string, unknown>;
		positionals: string[];
	};

	declare const parseArgs: <
		Flags extends AnyFlags,
		Strict extends boolean = true,
	>(
		config?: Options<Flags, Strict>,
	) => Result<Flags, Strict>;
}

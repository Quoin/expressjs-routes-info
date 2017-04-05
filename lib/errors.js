class RoutesInfoError extends Error {}

class DuplicateNameError extends RoutesInfoError {}
class InvalidValue extends RoutesInfoError {}
class MissingArgument extends RoutesInfoError {}

module.exports = {
    RoutesInfoError,
    DuplicateNameError,
    InvalidValue,
    MissingArgument
};

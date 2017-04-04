class RoutesInfoError extends Error {}

class DuplicateNameError extends RoutesInfoError {}
class InvalidBaseUrl extends RoutesInfoError {}
class MissingArgument extends RoutesInfoError {}

module.exports = {
    RoutesInfoError,
    DuplicateNameError,
    InvalidBaseUrl,
    MissingArgument
};
